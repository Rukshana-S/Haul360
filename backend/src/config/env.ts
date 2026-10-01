import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the backend directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  mongodbDbName: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'haul360',
};

export const validateConfig = (): void => {
  if (!config.mongodbUri || config.mongodbUri.trim() === '') {
    throw new Error('MONGODB_URI is not configured. Please define MONGODB_URI in your backend/.env file.');
  }
};
