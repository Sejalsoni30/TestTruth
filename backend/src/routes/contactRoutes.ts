import { Router } from 'express';
import { submitContactMessage } from '../controllers/contactController.js';

export const contactRouter = Router();

contactRouter.post('/', submitContactMessage);

