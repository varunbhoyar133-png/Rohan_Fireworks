import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Try connecting with provided URI if given
  if (uri) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[Database] Connected successfully to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Could not connect to configured MongoDB URI (${err.message}). Falling back to MongoMemoryServer for instant local run.`);
    }
  }

  // Fallback to in-memory MongoDB for local development if standard connection fails
  try {
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'rohan_fireworks',
      }
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to In-Memory MongoDB engine: ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error(`[Database] Failed to start fallback MongoDB instance:`, memErr);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
