import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from './config/env.js';

async function testBackend() {
  console.log('--- Starting Backend Verification Test ---');

  try {
    const dbUri = await connectDB();
    console.log('✓ Connected to DB:', dbUri);

    // 1. Test User Registration
    const testEmail = 'architect@testtruth.dev';
    await User.deleteMany({ email: testEmail });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('SecurePassword123!', salt);

    const user = await User.create({
      email: testEmail,
      passwordHash,
      name: 'Lead Architect',
      role: 'admin',
    });
    console.log('✓ Registered User successfully. ID:', user._id.toString());

    // 2. Test JWT Signing and Verification
    const token = jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role }, ENV.JWT_SECRET, { expiresIn: '1d' });
    const decoded: any = jwt.verify(token, ENV.JWT_SECRET);
    if (decoded.email !== testEmail) throw new Error('JWT verification mismatch');
    console.log('✓ JWT generated and verified for user:', decoded.email);

    // 3. Test Password Comparison
    const match = await bcrypt.compare('SecurePassword123!', user.passwordHash);
    if (!match) throw new Error('Password mismatch');
    console.log('✓ Password comparison validated');

    // 4. Test Project Creation
    const project = await Project.create({
      name: 'Payment Processing Service',
      description: 'Core billing and refund pipeline',
      userId: user._id,
      framework: 'jest',
      language: 'typescript',
    });
    console.log('✓ Created Project:', project.name, 'ID:', project._id.toString());

    // 5. Test Project Query
    const userProjects = await Project.find({ userId: user._id });
    if (userProjects.length !== 1) throw new Error('Project count mismatch');
    console.log('✓ Listed projects count:', userProjects.length);

    // Clean up
    await Project.deleteOne({ _id: project._id });
    await User.deleteOne({ _id: user._id });
    console.log('✓ Test cleanup completed');

    await disconnectDB();
    console.log('--- All Backend Unit & DB Verifications Passed Successfully! ---');
    process.exit(0);
  } catch (err) {
    console.error('✗ Backend verification failed:', err);
    process.exit(1);
  }
}

testBackend();

