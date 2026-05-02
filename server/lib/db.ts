import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://anshuljangidindian_db_user:<db_password>@cluster01.dejvuao.mongodb.net/canvas?retryWrites=true&w=majority';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing!');
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

    console.log('Connecting to MongoDB Atlas...');
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

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export default connectDB;
