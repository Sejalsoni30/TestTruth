import { Request, Response } from 'express';
import { z } from 'zod';
import { Message } from '../models/Message.js';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Simple in-memory IP rate limiter (max 5 requests per IP per 10 minutes)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function submitContactMessage(req: Request, res: Response): Promise<void> {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes

  const limitData = ipRateLimitMap.get(ip);
  if (limitData && limitData.resetTime > now) {
    if (limitData.count >= 5) {
      res.status(429).json({
        error: 'Too many messages sent from this IP address. Please wait a few minutes before trying again.',
      });
      return;
    }
    limitData.count++;
  } else {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.errors[0]?.message || 'Invalid contact form data',
    });
    return;
  }

  const msg = await Message.create({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    ipAddress: ip,
  });

  res.status(201).json({
    success: true,
    message: 'Your message has been securely recorded in our database. Our architecture team will review it shortly.',
    messageId: msg._id,
  });
}

