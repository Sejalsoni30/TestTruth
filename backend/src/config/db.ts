import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env.js';

let mongodInstance: MongoMemoryServer | null = null;

export async function connectDB(): Promise<string> {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.host || 'active-connection';
  }

  let uri = ENV.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`[DB] Attempting connection to configured MongoDB: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('[DB] Successfully connected to external MongoDB');
      return uri;
    } catch (err: any) {
      console.warn(`[DB] External MongoDB connection failed (${err.message}). Falling back to MongoMemoryServer...`);
    }
  }

  // Fallback to in-memory MongoDB for seamless zero-setup development
  try {
    console.log('[DB] Initializing local MongoMemoryServer instance...');
    mongodInstance = await MongoMemoryServer.create();
    uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log(`[DB] Successfully connected to MongoMemoryServer at ${uri}`);
    return uri;
  } catch (err: any) {
    console.error('[DB] Failed to initialize MongoMemoryServer:', err);
    throw err;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}
