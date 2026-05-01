import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://anshuljangidindian_db_user:2SJZ4SIptp7FKucb@cluster01.dejvuao.mongodb.net/?appName=Cluster01';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
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
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB Atlas');
        return mongoose;
      })
      .catch(async (err) => {
        console.error('❌ MongoDB Atlas connection failed:', err.message);
        
        // Try local fallback
        const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/aryans_art';
        console.log('Attempting local MongoDB fallback...');
        try {
          const localConn = await mongoose.connect(LOCAL_MONGO_URI, opts);
          console.log('✅ Connected to local MongoDB');
          return localConn;
        } catch (localErr: any) {
          console.error('❌ Local MongoDB fallback also failed:', localErr.message);
          return null; // Return null instead of throwing
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null; // Return null instead of throwing
  }

  return cached.conn;
}

export default connectDB;
