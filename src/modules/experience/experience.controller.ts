import { Request, Response } from "express";
import { Types } from "mongoose";

import { experienceService } from "./experience.service";

const createExperience = async (
  req: Request,
  res: Response
) => {
  try {
    const experience =
      await experienceService.createExperience(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create experience",
    });
  }
};

const getAllExperiences = async (
  _req: Request,
  res: Response
) => {
  try {
    const experiences =
      await experienceService.getAllExperiences();

    res.status(200).json({
      success: true,
      message:
        "Experiences retrieved successfully",
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve experiences",
    });
  }
};

const getActiveExperiences = async (
  _req: Request,
  res: Response
) => {
  try {
    const experiences =
      await experienceService.getActiveExperiences();

    res.status(200).json({
      success: true,
      message:
        "Active experiences retrieved successfully",
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve active experiences",
    });
  }
};

const getExperienceById = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid experience ID"
      );
    }

    const experience =
      await experienceService.getExperienceById(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message:
        "Experience retrieved successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve experience",
    });
  }
};

const updateExperience = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid experience ID"
      );
    }

    const experience =
      await experienceService.updateExperience(
        req.params.id as string,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update experience",
    });
  }
};

const deleteExperience = async (
  req: Request,
  res: Response
) => {
  try {
    if (
      !Types.ObjectId.isValid(
        req.params.id as string
      )
    ) {
      throw new Error(
        "Invalid experience ID"
      );
    }

    const experience =
      await experienceService.deleteExperience(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message:
        "Experience deleted successfully",
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete experience",
    });
  }
};

export const experienceController = {
  createExperience,
  getAllExperiences,
  getActiveExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};