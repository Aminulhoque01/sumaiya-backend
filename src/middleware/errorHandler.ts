import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

interface AppError extends Error {
  statusCode?: number;
  status?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<
    string,
    {
      message: string;
      path: string;
    }
  >;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Global Error:", error);

  /**
   * -----------------------------------------
   * Mongoose Validation Error
   * -----------------------------------------
   */
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(
      (item) => ({
        field: item.path,
        message: item.message,
      })
    );

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });

    return;
  }

  /**
   * -----------------------------------------
   * Mongoose Cast Error
   * -----------------------------------------
   *
   * Example:
   * Invalid MongoDB ObjectId
   */
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid ${error.path}: ${error.value}`,
      errors: [],
    });

    return;
  }

  /**
   * -----------------------------------------
   * MongoDB Duplicate Key Error
   * -----------------------------------------
   */
  if (error.code === 11000) {
    const duplicateFields =
      error.keyValue
        ? Object.keys(error.keyValue)
        : [];

    res.status(409).json({
      success: false,
      message: `Duplicate value for: ${duplicateFields.join(
        ", "
      )}`,
      errors: [],
    });

    return;
  }

  /**
   * -----------------------------------------
   * JWT / Authentication Errors
   * -----------------------------------------
   */
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Authentication token has expired"
          : "Invalid authentication token",
      errors: [],
    });

    return;
  }

  /**
   * -----------------------------------------
   * Custom Application Error
   * -----------------------------------------
   */
  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message || "Something went wrong",
    errors: [],
  });
};