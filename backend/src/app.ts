import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Security Middleware
  app.use(helmet());

  // CORS - allow all origins in development for Expo mobile app communication
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // HTTP Request Logger
  app.use(morgan('dev'));

  // Body Parsing Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root Welcome & Health Check Routes
  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Haul360 Backend API Server is running',
      version: '1.0.0',
      routes: {
        health: '/api/health',
        auth: '/api/auth',
        mechanic: '/api/mechanic',
      },
    });
  });

  app.get('/health', (_req, res, next) => {
    // Forward /health to the api health check handler
    import('./controllers/healthController').then(({ getHealth }) => getHealth(_req, res)).catch(next);
  });

  // API Routes
  app.use('/api', routes);

  // 404 Not Found Middleware
  app.use(notFoundHandler);

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

export default createApp;
