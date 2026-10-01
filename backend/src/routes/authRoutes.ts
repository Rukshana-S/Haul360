import { Router } from 'express';
import { register, login, refresh, getMe } from '../controllers/authController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected Routes
router.get('/me', authenticate, getMe);

// Role-Protected Example Verification Route
router.get('/role-mechanic', authenticate, requireRole('mechanic'), (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized: Mechanic access granted',
  });
});

export default router;
