import dns from 'dns';
import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { config, validateConfig } from './env';

// Configure DNS resolvers for MongoDB Atlas SRV query resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {
  // Ignore if unsupported
}

let client: MongoClient | null = null;
let database: Db | null = null;

/**
 * Connect to MongoDB Atlas using the official MongoDB Node.js driver.
 * Reuses a single MongoClient instance across the backend application.
 */
export const connectDatabase = async (): Promise<Db> => {
  if (database && client) {
    return database;
  }

  validateConfig();

  try {
    client = new MongoClient(config.mongodbUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    await client.connect();
    
    // Ping to verify connection
    await client.db('admin').command({ ping: 1 });
    
    database = client.db(config.mongodbDbName);
    console.log(`✅ Connected to MongoDB database: "${config.mongodbDbName}"`);
    return database;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    client = null;
    database = null;
    throw error;
  }
};

/**
 * Get the active database instance.
 * Throws if the database has not been initialized.
 */
export const getDatabase = (): Db => {
  if (!database) {
    throw new Error('Database is not connected. Call connectDatabase() before accessing the database.');
  }
  return database;
};

/**
 * Get the active MongoClient instance.
 */
export const getMongoClient = (): MongoClient => {
  if (!client) {
    throw new Error('MongoClient is not initialized.');
  }
  return client;
};

/**
 * Check whether the database is actively connected and reachable.
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  if (!client || !database) {
    return false;
  }
  try {
    await database.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
};

/**
 * Gracefully close the MongoDB client connection.
 */
export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    database = null;
    console.log('MongoDB connection closed.');
  }
};
