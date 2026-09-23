import app from "../app";
import connectDB from "../config/db";

 

export default async function handler(req: any, res: any) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}