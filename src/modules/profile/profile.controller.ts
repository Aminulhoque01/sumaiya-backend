import { Request, Response } from "express";
import { profileService } from "./profile.service";

const parseBody = (body: any) => {
  if (typeof body.data === "string") {
    try {
      return JSON.parse(body.data);
    } catch {
      throw new Error("Invalid JSON format in data field");
    }
  }

  return body;
};

const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = parseBody(req.body);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profileImageBuffer =
      files?.profileImage?.[0]?.buffer;

    const coverImageBuffer =
      files?.coverImage?.[0]?.buffer;

    const profile = await profileService.createProfile(
      payload,
      profileImageBuffer,
      coverImageBuffer
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create profile",
    });
  }
};

const getProfile = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const profile = await profileService.getProfile();

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get profile",
    });
  }
};

const getProfileForAdmin = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const profile = await profileService.getProfileForAdmin();

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get profile",
    });
  }
};

const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payload = parseBody(req.body);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const profileImageBuffer =
      files?.profileImage?.[0]?.buffer;

    const coverImageBuffer =
      files?.coverImage?.[0]?.buffer;

    const profile = await profileService.updateProfile(
      payload,
      profileImageBuffer,
      coverImageBuffer
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update profile",
    });
  }
};

const deleteProfile = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    await profileService.deleteProfile();

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete profile",
    });
  }
};

const getProfileById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const profile = await profileService.getProfileById(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get profile",
    });
  }
};

export const profileController = {
  createProfile,
  getProfile,
  getProfileForAdmin,
  updateProfile,
  deleteProfile,
  getProfileById,
};