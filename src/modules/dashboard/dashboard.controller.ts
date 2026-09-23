import { Request, Response } from "express";

import {
  dashboardService,
} from "./dashboard.service";

const getDashboardStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result =
      await dashboardService.getDashboardStats();

    res.status(200).json({
      success: true,
      message:
        "Dashboard statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve dashboard statistics",
    });
  }
};

export const dashboardController = {
  getDashboardStats,
};