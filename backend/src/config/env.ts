import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the backend directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  mongodbDbName: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'haul360',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

export const validateConfig = (): void => {
  if (!config.mongodbUri || config.mongodbUri.trim() === '') {
    throw new Error('MONGODB_URI is not configured. Please define MONGODB_URI in your backend/.env file.');
  }
  if (!config.jwtAccessSecret || config.jwtAccessSecret.trim() === '') {
    throw new Error('JWT_ACCESS_SECRET is not configured. Please define JWT_ACCESS_SECRET in your backend/.env file.');
  }
  if (!config.jwtRefreshSecret || config.jwtRefreshSecret.trim() === '') {
    throw new Error('JWT_REFRESH_SECRET is not configured. Please define JWT_REFRESH_SECRET in your backend/.env file.');
  }
};
