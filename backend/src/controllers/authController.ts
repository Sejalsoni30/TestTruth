import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { seedDemoDataIfEmpty } from '../services/seedDemoData.js';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

function signToken(userId: string, email: string, role: 'admin' | 'member'): string {
  return jwt.sign({ userId, email, role }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    passwordHash,
    name,
    role: 'member',
  });

  const token = signToken(user._id.toString(), user.email, user.role);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = signToken(user._id.toString(), user.email, user.role);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}

export async function getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await User.findById(req.user.userId).select('-passwordHash');
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  let user = await User.findOne({ email: 'demo@testtruth.io' });
  if (!user) {
    await seedDemoDataIfEmpty();
    user = await User.findOne({ email: 'demo@testtruth.io' });
  }

  if (!user) {
    res.status(500).json({ error: 'Demo workspace initialization failed' });
    return;
  }

  const token = signToken(user._id.toString(), user.email, user.role);

  res.status(200).json({
    message: 'Authenticated as Demo Lead',
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}
