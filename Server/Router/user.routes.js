import express from 'express';
import { register, login, getCurrentUser, logout, refresh } from '../Controller/User.controller.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticateToken, getCurrentUser);
router.get('/logout', authenticateToken, logout);

export default router;
