import express from 'express';
import { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// FIX: logout uses optionalAuth (works even with expired token) — logout always succeeds
router.post('/logout', optionalAuth, logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;
