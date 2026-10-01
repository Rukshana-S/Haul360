import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthTokenPayload } from '../types/auth';

/**
 * Generate a short-lived access token containing minimal user identity.
 */
export const generateAccessToken = (payload: AuthTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId: payload.userId, role: payload.role }, config.jwtAccessSecret, options);
};

/**
 * Generate a long-lived refresh token.
 */
export const generateRefreshToken = (payload: AuthTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ userId: payload.userId, role: payload.role }, config.jwtRefreshSecret, options);
};

/**
 * Verify and decode an access token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 */
export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, config.jwtAccessSecret) as AuthTokenPayload;
  return {
    userId: decoded.userId,
    role: decoded.role,
  };
};

/**
 * Verify and decode a refresh token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 */
export const verifyRefreshToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, config.jwtRefreshSecret) as AuthTokenPayload;
  return {
    userId: decoded.userId,
    role: decoded.role,
  };
};
