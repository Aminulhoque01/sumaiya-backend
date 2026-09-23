import { Request, Response } from "express";

import {
  settingsService,
} from "./settings.service";

const getSettings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result =
      await settingsService.getSettings();

    res.status(200).json({
      success: true,
      message:
        "Site settings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve site settings",
    });
  }
};

const getSettingsForAdmin = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result =
      await settingsService.getSettingsForAdmin();

    res.status(200).json({
      success: true,
      message:
        "Admin site settings retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve site settings",
    });
  }
};

const createSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result =
      await settingsService.createSettings(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Site settings created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create site settings",
    });
  }
};

const updateSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result =
      await settingsService.updateSettings(
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Site settings updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update site settings",
    });
  }
};

const deleteSettings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    await settingsService.deleteSettings();

    res.status(200).json({
      success: true,
      message:
        "Site settings deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete site settings",
    });
  }
};

const toggleSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean",
      });

      return;
    }

    const result =
      await settingsService.toggleSettings(
        isActive
      );

    res.status(200).json({
      success: true,
      message:
        "Site settings status updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update site settings status",
    });
  }
};

export const settingsController = {
  getSettings,
  getSettingsForAdmin,
  createSettings,
  updateSettings,
  deleteSettings,
  toggleSettings,
};