import connectDB from "../config/db";
import app from "../server";

 
export default async function handler(req: any, res: any) {
  try {
    await connectDB();

    return app(req, res);
  } catch (error) {
    console.error("Vercel API error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}