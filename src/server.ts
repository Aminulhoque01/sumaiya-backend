import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

// Routes
import authRouter from "./modules/auth/auth.route";
import categoryRouter from "./modules/category/category.route";
import projectRouter from "./modules/project/project.route";
import serviceRouter from "./modules/service/service.route";
import skillRouter from "./modules/skill/skill.route";
import experienceRouter from "./modules/experience/experience.route";
import testimonialRouter from "./modules/testimonial/testimonial.route";
import profileRouter from "./modules/profile/profile.route";
import contactRouter from "./modules/contact/contact.route";
import aiRouter from "./modules/ai/ai.route";
import settingRouter from "./modules/settings/settings.route";
import dashboardRouter from "./modules/dashboard/dashboard.route";

import { errorHandler } from "./middleware/errorHandler";

// ===============================
// App
// ===============================

const app = express();

// ===============================
// Middleware
// ===============================

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ===============================
// Health Check
// ===============================

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Sumaiya Portfolio API is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/projects", projectRouter);
app.use("/api/services", serviceRouter);
app.use("/api/skills", skillRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/profile", profileRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/ai-chat", aiRouter);
app.use("/api/settings", settingRouter);
app.use("/api/dashboard", dashboardRouter);

// ===============================
// 404
// ===============================

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// Error Handler
// ===============================

app.use(errorHandler);

// ===============================
// MongoDB Connection
// ===============================

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? {
    conn: null,
    promise: null,
  };

global.mongooseCache = cached;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection is currently being established
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

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
      cached.promise = null;

      console.error("MongoDB connection failed:", error);

      throw error;
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

// ===============================
// Local Development
// ===============================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server failed to start:", error);
      process.exit(1);
    });
}

// ===============================
// Export
// ===============================

export default app;