import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};