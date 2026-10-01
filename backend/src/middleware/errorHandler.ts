import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { config } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] [${statusCode}]:`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { error: err.name }),
  });
};
