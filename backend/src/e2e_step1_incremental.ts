import fs from 'fs';
import path from 'path';
import { startServer } from './index.js';
import { disconnectDB } from './config/db.js';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runStep1Acceptance() {
  console.log('===============================================================');
  console.log('   TESTTRUTH RELEASE 2 - STEP 1 ACCEPTANCE VERIFICATION       ');
  console.log('   Incremental Mutation Runs & File Hash Delta Execution       ');
  console.log('===============================================================\n');

  const PORT = process.env.PORT || 5000;
  const BASE_URL = `http://127.0.0.1:${PORT}/api`;
  let server: any = null;

  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    if (healthRes.ok) {
      console.log(`[E2E] Connected to active TestTruth API server at ${BASE_URL}`);
    } else {
      server = await startServer();
    }
  } catch {
    server = await startServer();
  }

  try {
    // 1. Auth Setup
    console.log('[1/6] Registering QA Engineer user...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `qa.step1.${Date.now()}@testtruth.io`,
        password: 'Password123!',
        name: 'Step 1 Verification Lead',
      }),
    });
    const regData = (await registerRes.json()) as any;
    const token = regData.token;
    console.log('✓ Registered successfully. Token obtained.');

    // 2. Project Creation
    console.log('\n[2/6] Creating "Weak Calculator" project...');
    const projRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Weak Calculator Test Suite',
        description: 'Sample project with weak assertions and edge case gaps',
        framework: 'jest',
        language: 'javascript',
      }),
    });
    const projData = (await projRes.json()) as any;
    const projectId = projData.project._id;
    console.log(`✓ Project created: ${projData.project.name} (ID: ${projectId})`);

    // 3. Upload Sample ZIP
    console.log('\n[3/6] Uploading samples/weak-calculator.zip...');
    let zipPath = path.resolve(process.cwd(), 'samples/weak-calculator.zip');
    if (!fs.existsSync(zipPath)) {
      zipPath = path.resolve(process.cwd(), '../samples/weak-calculator.zip');
    }
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Sample zip not found at: ${zipPath}`);
    }

    const fileBuffer = fs.readFileSync(zipPath);
    const form = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/zip' });
    form.append('files', blob, 'weak-calculator.zip');

    const uploadRes = await fetch(`${BASE_URL}/projects/${projectId}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form as any,
    });
    const uploadData = (await uploadRes.json()) as any;
    console.log('✓ Upload response:', uploadData.message);

    // Verify files in DB
    const projDetailsRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projDetails = (await projDetailsRes.json()) as any;
    console.log(`✓ Files indexed: ${projDetails.files.length} files (${projDetails.files.map((f: any) => f.relativePath).join(', ')})`);

    // 4. Initial Run (Full Run)
    console.log('\n[4/6] Triggering Initial Run 1 (forceFullRun: false)...');
    const run1StartRes = await fetch(`${BASE_URL}/runs/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId, forceFullRun: false }),
    });
    const run1Start = (await run1StartRes.json()) as any;
    const run1Id = run1Start.runId;
    console.log(`✓ Run 1 queued with ID: ${run1Id}`);

    // Poll Run 1 until completion
    let run1Status: any;
    while (true) {
      await sleep(1000);
      const pollRes = await fetch(`${BASE_URL}/runs/${run1Id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      run1Status = await pollRes.json();
      console.log(`  [Run 1] stage: ${run1Status.progressStage} | message: ${run1Status.progressMessage}`);
      if (run1Status.status === 'completed' || run1Status.status === 'failed') break;
    }

    if (run1Status.status !== 'completed') {
      throw new Error(`Run 1 failed: ${run1Status.errorMessage}`);
    }

    console.log('\n--- Run 1 Telemetry (Initial Full Run) ---');
    console.log(`  Run Mode: ${run1Status.runModeLabel}`);
    console.log(`  Is Incremental: ${run1Status.isIncremental}`);
    console.log(`  Duration: ${run1Status.durationMs}ms`);
    console.log(`  Total Mutants: ${run1Status.summaryMetrics.totalMutants}`);
    console.log(`  Killed: ${run1Status.summaryMetrics.killedMutants} | Survived: ${run1Status.summaryMetrics.survivedMutants}`);
    console.log(`  Kill Rate: ${run1Status.summaryMetrics.mutationKillRate}%`);
    console.log(`  Total Findings: ${run1Status.summaryMetrics.totalFindings} (Weak Assertions: ${run1Status.summaryMetrics.weakAssertionsCount}, Run-only: ${run1Status.summaryMetrics.runOnlyTestsCount})`);
    console.log(`  Docker Available: ${run1Status.dockerAvailable}`);

    const duration1 = run1Status.durationMs;

    // 5. Modify ONE file and trigger Incremental Run
    console.log('\n[5/6] Modifying ONLY src/calculator.js to test Incremental Execution...');
    const calcFile = projDetails.files.find((f: any) => f.relativePath === 'src/calculator.js');
    if (!calcFile) throw new Error('src/calculator.js not found in project files');

    // Fetch existing content and modify one line
    const fileGetRes = await fetch(`${BASE_URL}/projects/${projectId}/files/${calcFile._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fileGetData = (await fileGetRes.json()) as any;
    const originalContent = fileGetData.file.content;

    // Add a helper function to src/calculator.js
    const modifiedContent = originalContent + '\n\nfunction multiplyByTwo(x) { return x * 2; }\nmodule.exports.multiplyByTwo = multiplyByTwo;\n';

    const fileUpdateRes = await fetch(`${BASE_URL}/projects/${projectId}/files/${calcFile._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: modifiedContent }),
    });
    const fileUpdateData = (await fileUpdateRes.json()) as any;
    console.log(`✓ Updated src/calculator.js in database. New hash: ${fileUpdateData.file.contentHash}`);

    // Trigger Run 2 (Incremental)
    console.log('\nTriggering Run 2 (forceFullRun: false)...');
    const run2StartRes = await fetch(`${BASE_URL}/runs/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId, forceFullRun: false }),
    });
    const run2Start = (await run2StartRes.json()) as any;
    const run2Id = run2Start.runId;
    console.log(`✓ Run 2 queued with ID: ${run2Id}`);

    let run2Status: any;
    while (true) {
      await sleep(1000);
      const pollRes = await fetch(`${BASE_URL}/runs/${run2Id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      run2Status = await pollRes.json();
      console.log(`  [Run 2] stage: ${run2Status.progressStage} | message: ${run2Status.progressMessage}`);
      if (run2Status.status === 'completed' || run2Status.status === 'failed') break;
    }

    if (run2Status.status !== 'completed') {
      throw new Error(`Run 2 failed: ${run2Status.errorMessage}`);
    }

    console.log('\n--- Run 2 Telemetry (Incremental Run) ---');
    console.log(`  Run Mode: ${run2Status.runModeLabel}`);
    console.log(`  Is Incremental: ${run2Status.isIncremental}`);
    console.log(`  Changed Files Count: ${run2Status.changedFilesCount}`);
    console.log(`  Reused Mutants Count: ${run2Status.reusedMutantsCount}`);
    console.log(`  Duration: ${run2Status.durationMs}ms (vs Run 1: ${duration1}ms)`);
    console.log(`  Total Mutants: ${run2Status.summaryMetrics.totalMutants}`);
    console.log(`  Killed: ${run2Status.summaryMetrics.killedMutants} | Survived: ${run2Status.summaryMetrics.survivedMutants}`);

    // Verifications for Acceptance:
    if (!run2Status.isIncremental) {
      throw new Error('Acceptance Failed: Run 2 was not marked as incremental!');
    }
    if (run2Status.changedFilesCount !== 1) {
      throw new Error(`Acceptance Failed: Expected 1 changed file, but got ${run2Status.changedFilesCount}`);
    }
    if (run2Status.reusedMutantsCount <= 0) {
      throw new Error('Acceptance Failed: Reused mutants count should be > 0 for unchanged mathUtils.js!');
    }
    console.log('✓ Incremental Acceptance Passed: Only changed file was mutated, unchanged mutants reused!');

    // 6. Test Force Full Run
    console.log('\n[6/6] Testing "Force Full Run" button (forceFullRun: true)...');
    const run3StartRes = await fetch(`${BASE_URL}/runs/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId, forceFullRun: true }),
    });
    const run3Start = (await run3StartRes.json()) as any;
    const run3Id = run3Start.runId;

    let run3Status: any;
    while (true) {
      await sleep(1000);
      const pollRes = await fetch(`${BASE_URL}/runs/${run3Id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      run3Status = await pollRes.json();
      if (run3Status.status === 'completed' || run3Status.status === 'failed') break;
    }

    console.log('\n--- Run 3 Telemetry (Force Full Run) ---');
    console.log(`  Run Mode: ${run3Status.runModeLabel}`);
    console.log(`  Is Incremental: ${run3Status.isIncremental}`);
    console.log(`  Reused Mutants: ${run3Status.reusedMutantsCount}`);

    if (run3Status.isIncremental !== false) {
      throw new Error('Acceptance Failed: Force full run should not be incremental');
    }
    if (run3Status.reusedMutantsCount !== 0) {
      throw new Error('Acceptance Failed: Force full run should not reuse cached mutants');
    }
    console.log('✓ Force Full Run Acceptance Passed!');

    console.log('\n===============================================================');
    console.log('🎉 STEP 1 ACCEPTANCE VERIFICATION COMPLETED WITH 100% SUCCESS!');
    console.log('===============================================================');

    if (server) {
      server.close();
      await disconnectDB();
    }
    process.exit(0);
  } catch (err) {
    console.error('✗ Step 1 Acceptance Verification Failed:', err);
    if (server) {
      server.close();
      await disconnectDB();
    }
    process.exit(1);
  }
}

runStep1Acceptance();
