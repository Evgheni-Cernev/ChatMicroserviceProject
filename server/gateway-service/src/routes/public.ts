// src/routes/public.ts
import { Router } from 'express';
import { login, register } from '../controllers/authController';

const router = Router();



// Public routes
router.post('/login', login);
router.post('/register', register);

export { router as publicRoutes };
