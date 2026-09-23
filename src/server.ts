import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import authRouter from "./modules/auth/auth.route";
import categoryRouter from "./modules/category/category.route";
import projectRouter from "./modules/project/project.route";
import ServiceRouter from "./modules/service/service.route";
import skillRouter from "./modules/skill/skill.route";
import experienceRouter from "./modules/experience/experience.route";
import testimonialRouter from "./modules/testimonial/testimonial.route";
import profileRouter from "./modules/profile/profile.route";
import contactRouter from "./modules/contact/contact.route";
import aiRouter from "./modules/ai/ai.route";
import settingRouter from "./modules/settings/settings.route";
import dashboardRouter from "./modules/dashboard/dashboard.route";

// Middleware
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

/* =========================================================
   MongoDB Connection
========================================================= */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    console.log("MongoDB connected successfully");

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("MongoDB connection failed:", error);

    throw error;
  }
};

/* =========================================================
   Express App
========================================================= */

const app = express();

/* Security */
app.use(helmet());

/* CORS */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* Body Parser */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* Logger */
app.use(morgan("dev"));

/* =========================================================
   Health Check
========================================================= */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Sumaiya Portfolio API is running",
  });
});

/* =========================================================
   API Routes
========================================================= */

app.use("/api/auth", authRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/projects", projectRouter);

app.use("/api/services", ServiceRouter);

app.use("/api/skills", skillRouter);

app.use("/api/experiences", experienceRouter);

app.use("/api/testimonials", testimonialRouter);

app.use("/api/profile", profileRouter);

app.use("/api/contacts", contactRouter);

app.use("/api/ai-chat", aiRouter);

app.use("/api/settings", settingRouter);

app.use("/api/dashboard", dashboardRouter);

/* =========================================================
   404 Handler
========================================================= */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================================
   Global Error Handler
========================================================= */

app.use(errorHandler);

/* =========================================================
   Local Development
========================================================= */

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
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

/* =========================================================
   Export
========================================================= */

export { app, connectDB };

export default app;