import { startServer } from './index.js';
import { disconnectDB } from './config/db.js';

async function runE2EGate() {
  console.log('=== TESTTRUTH PHASE 2 GATE VERIFICATION ===');
  const server = await startServer();
  const PORT = process.env.PORT || 5000;
  const BASE_URL = `http://127.0.0.1:${PORT}/api`;

  try {
    // 1. Health check
    console.log('\n[1/7] Testing API Health endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = (await healthRes.json()) as any;
    console.log('✓ Health Status:', healthData.status, '| Service:', healthData.service);

    // 2. User Registration
    console.log('\n[2/7] Testing User Registration (/api/auth/register)...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'qa.lead@testtruth.io',
        password: 'SuperSecretPassword2026!',
        name: 'Alex Rivera',
      }),
    });
    const registerData = (await registerRes.json()) as any;
    if (!registerRes.ok) throw new Error(`Registration failed: ${JSON.stringify(registerData)}`);
    console.log('✓ User registered successfully:', registerData.user.email, '| ID:', registerData.user.id);
    const token = registerData.token;

    // 3. User Login
    console.log('\n[3/7] Testing User Login (/api/auth/login)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'qa.lead@testtruth.io',
        password: 'SuperSecretPassword2026!',
      }),
    });
    const loginData = (await loginRes.json()) as any;
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    console.log('✓ Login authenticated. Token received length:', loginData.token.length);

    // 4. Current User Session Check
    console.log('\n[4/7] Testing Authenticated Session (/api/auth/me)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = (await meRes.json()) as any;
    if (!meRes.ok) throw new Error(`Me endpoint failed: ${JSON.stringify(meData)}`);
    console.log('✓ Auth session verified for:', meData.user.name, `(${meData.user.role})`);

    // 5. Create Project Workspace
    console.log('\n[5/7] Testing Project Workspace Creation (/api/projects)...');
    const projectRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Billing Gateway Service',
        description: 'Payment settlement and currency conversion test suite',
        framework: 'jest',
        language: 'typescript',
      }),
    });
    const projectData = (await projectRes.json()) as any;
    if (!projectRes.ok) throw new Error(`Project creation failed: ${JSON.stringify(projectData)}`);
    const projectId = projectData.project._id;
    console.log('✓ Project created:', projectData.project.name, '| ID:', projectId);

    // 6. Test Dashboard Telemetry & Disclosure Endpoint
    console.log('\n[6/7] Testing Dashboard Metrics & Honesty Disclosure (/api/runs/dashboard-metrics)...');
    const metricsRes = await fetch(`${BASE_URL}/runs/dashboard-metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const metricsData = (await metricsRes.json()) as any;
    if (!metricsRes.ok) throw new Error(`Metrics failed: ${JSON.stringify(metricsData)}`);
    console.log('✓ Dashboard Metrics received:');
    console.log('   - Total Projects:', metricsData.metrics.totalProjects);
    console.log('   - Tests Analysed:', metricsData.metrics.testsAnalysed);
    console.log('   - Kill Rate (%):', metricsData.metrics.killRate);
    console.log('   - Formula Documentation:', metricsData.formulaDocumentation.metric);
    console.log('   - Honesty Inherent Limitations:', metricsData.formulaDocumentation.inherentLimitations.length, 'rules specified');

    // 7. Delete Project with Confirmation
    console.log('\n[7/7] Testing Delete Project with Name Confirmation (/api/projects/:id)...');
    const deleteRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        confirmProjectName: 'Billing Gateway Service',
      }),
    });
    const deleteData = (await deleteRes.json()) as any;
    if (!deleteRes.ok) throw new Error(`Delete failed: ${JSON.stringify(deleteData)}`);
    console.log('✓ Project successfully deleted:', deleteData.message);

    console.log('\n======================================================');
    console.log('🎉 PHASE 2 GATE VERIFICATION PASSED WITH 100% SUCCESS!');
    console.log('======================================================');

    server.close();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('✗ Phase 2 Gate Verification Failed:', err);
    if (server) server.close();
    await disconnectDB();
    process.exit(1);
  }
}

runE2EGate();

