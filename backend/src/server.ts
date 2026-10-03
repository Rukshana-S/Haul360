import { createApp } from './app';
import { config } from './config/env';
import { connectDatabase, closeDatabase } from './config/database';
import { initializeDatabaseIndexes } from './config/databaseIndexes';
import { runDatabaseMigrations } from './config/migrations';

const startServer = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await connectDatabase();

    // 2. Run Database Migrations (Canonical Schema Consolidation)
    await runDatabaseMigrations();

    // 3. Initialize Database Indexes
    await initializeDatabaseIndexes();

    // 3. Initialize Express application
    const app = createApp();

    // 3. Start Express HTTP Server
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`\n==============================================`);
      console.log(`🚀 Haul360 Backend Server is running!`);
      console.log(`📍 URL: http://0.0.0.0:${config.port} (All Network Interfaces)`);
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
