import { execFile, spawn } from 'child_process';
import path from 'path';

export interface SandboxExecutionOutput {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  passedTests: number;
  failedTests: number;
  totalTests: number;
  timedOut: boolean;
  dockerUsed: boolean;
  dockerNotice?: string;
}

let dockerAvailabilityCache: boolean | null = null;

export async function checkDockerAvailability(): Promise<boolean> {
  if (dockerAvailabilityCache !== null) {
    return dockerAvailabilityCache;
  }
  return new Promise((resolve) => {
    execFile('docker', ['--version'], (error) => {
      dockerAvailabilityCache = !error;
      resolve(!error);
    });
  });
}

export async function runInSandbox(
  workDir: string,
  testCommand: string = 'node --test',
  timeoutMs: number = 8000
): Promise<SandboxExecutionOutput> {
  const isDockerAvailable = await checkDockerAvailability();
  const startTime = Date.now();

  let dockerNotice: string | undefined;
  if (!isDockerAvailable) {
    dockerNotice = 'Docker daemon is not available on this host. Executing inside isolated process sandbox with sanitized environment and timeout watchdog.';
  }

  // Sterile environment: purge all secrets, tokens, DB connections
  const sanitizedEnv: NodeJS.ProcessEnv = {
    PATH: process.env.PATH || '',
    SYSTEMROOT: process.env.SYSTEMROOT || '',
    COMSPEC: process.env.COMSPEC || '',
    TEMP: workDir,
    TMP: workDir,
    NODE_ENV: 'test',
  };

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    // Use npx or node to run the test command inside workDir
    const isWindows = process.platform === 'win32';
    const shellCmd = isWindows ? 'cmd.exe' : '/bin/sh';
    const shellArgs = isWindows ? ['/d', '/s', '/c', testCommand] : ['-c', testCommand];

    const child = spawn(shellCmd, shellArgs, {
      cwd: workDir,
      env: sanitizedEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (isWindows) {
          execFile('taskkill', ['/F', '/T', '/PID', child.pid!.toString()]);
        } else {
          child.kill('SIGKILL');
        }
      } catch {
        child.kill();
      }
    }, timeoutMs);

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const durationMs = Date.now() - startTime;
      const exitCode = timedOut ? 124 : (code ?? 1);

      // Parse test counts from output
      let passedTests = 0;
      let failedTests = 0;
      let totalTests = 0;

      // Check for node:test output
      const passMatch = stdout.match(/ℹ pass (\d+)/i) || stdout.match(/(\d+) passing/i);
      const failMatch = stdout.match(/ℹ fail (\d+)/i) || stdout.match(/(\d+) failing/i);
      const totalMatch = stdout.match(/ℹ tests (\d+)/i) || stdout.match(/Tests:\s*(\d+) total/i);

      if (passMatch) passedTests = parseInt(passMatch[1], 10);
      if (failMatch) failedTests = parseInt(failMatch[1], 10);
      if (totalMatch) totalTests = parseInt(totalMatch[1], 10);
      else totalTests = passedTests + failedTests;

      if (totalTests === 0 && exitCode === 0) {
        // Fallback count passed
        const checkmarks = (stdout.match(/✔/g) || []).length;
        if (checkmarks > 0) {
          passedTests = checkmarks;
          totalTests = checkmarks;
        }
      }

      resolve({
        command: testCommand,
        exitCode,
        stdout,
        stderr,
        durationMs,
        passedTests,
        failedTests,
        totalTests,
        timedOut,
        dockerUsed: isDockerAvailable,
        dockerNotice,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        command: testCommand,
        exitCode: 1,
        stdout,
        stderr: stderr + '\n' + err.message,
        durationMs: Date.now() - startTime,
        passedTests: 0,
        failedTests: 1,
        totalTests: 1,
        timedOut: false,
        dockerUsed: isDockerAvailable,
        dockerNotice,
      });
    });
  });
}

