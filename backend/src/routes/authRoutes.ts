import { Router } from 'express';
import { register, login, getCurrentUser, demoLogin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/demo-login', demoLogin);
authRouter.get('/me', requireAuth, getCurrentUser);

