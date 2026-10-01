import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/auth';
import { UserRole } from '../models/users';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Authentication Middleware
 * Validates the JWT Bearer token in the Authorization header.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid Bearer token.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};

/**
 * Role-Based Authorization Middleware Factory
 * Ensures the authenticated user possesses one of the required roles.
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  };
};
