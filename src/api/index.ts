import app from "../app";
import connectDB from "../config/db";

 

let isConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("❌ Vercel server error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}