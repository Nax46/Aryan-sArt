import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ CRITICAL: MONGO_URI environment variable is missing!');
  console.error('Please add MONGO_URI to your Railway variables or .env file.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    if (!MONGO_URI) {
      console.error('❌ MONGO_URI is missing. Cannot connect to DB.');
      cached.promise = Promise.reject(new Error('MONGO_URI is missing'));
    } else {
      cached.promise = mongoose.connect(MONGO_URI, opts)
        .then((mongoose) => {
        console.log('✅ Successfully connected to MongoDB Atlas');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error Details:', {
          message: err.message,
          code: err.code,
          name: err.name
        });
        return null;
      });
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export default connectDB;
