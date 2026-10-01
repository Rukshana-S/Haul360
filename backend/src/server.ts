import { createApp } from './app';
import { config } from './config/env';
import { connectDatabase, closeDatabase } from './config/database';
import { initializeDatabaseIndexes } from './config/databaseIndexes';

const startServer = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await connectDatabase();

    // 2. Initialize Database Indexes
    await initializeDatabaseIndexes();

    // 3. Initialize Express application
    const app = createApp();

    // 3. Start Express HTTP Server
    const server = app.listen(config.port, () => {
      console.log(`\n==============================================`);
      console.log(`🚀 Haul360 Backend Server is running!`);
      console.log(`📍 URL: http://localhost:${config.port}`);
      console.log(`🏥 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`🌱 Environment: ${config.nodeEnv}`);
      console.log(`==============================================\n`);
    });

    // Graceful shutdown handling
    const handleShutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
