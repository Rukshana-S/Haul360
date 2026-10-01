import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../config/database';

export const getHealth = async (_req: Request, res: Response): Promise<void> => {
  const isDbConnected = await checkDatabaseHealth();

  if (isDbConnected) {
    res.status(200).json({
      success: true,
      message: 'Haul360 API is running',
      database: 'connected',
    });
  } else {
    res.status(503).json({
      success: false,
      message: 'Haul360 API is running with degraded service',
      database: 'disconnected',
    });
  }
};
