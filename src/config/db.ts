import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

const connectDB = async (): Promise<typeof mongoose> => {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Connection is already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    console.log("✅ MongoDB connected");

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("❌ MongoDB connection failed:", error);

    throw error;
  }
};

export default connectDB;