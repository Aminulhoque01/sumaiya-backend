import { Request, Response } from "express";

import { authService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerAdmin(req.body);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginAdmin(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      message: "Admin profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const authController = {
  register,
  login,
  getMe,
};