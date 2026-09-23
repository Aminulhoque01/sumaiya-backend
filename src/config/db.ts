import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? {
    conn: null,
    promise: null,
  };

global.mongooseCache = cached;

const connectDB = async (): Promise<typeof mongoose> => {
  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // Connection is already in progress
  if (cached.promise) {
    console.log("Waiting for existing MongoDB connection...");

    cached.conn = await cached.promise;

    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("Connecting to MongoDB...");

  cached.promise = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    })
    .then((mongooseInstance) => {
      console.log("MongoDB connected successfully");

      return mongooseInstance;
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);

      cached.promise = null;

      throw error;
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

export default connectDB;