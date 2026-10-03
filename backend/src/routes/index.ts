import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import mechanicRoutes from './mechanicRoutes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/mechanic', mechanicRoutes);

export default router;

