import { Request, Response } from "express";
import { Types } from "mongoose";

import { skillService } from "./skill.service";

const createSkill = async (
  req: Request,
  res: Response
) => {
  try {
    const skill =
      await skillService.createSkill(req.body);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create skill",
    });
  }
};

const getAllSkills = async (
  _req: Request,
  res: Response
) => {
  try {
    const skills =
      await skillService.getAllSkills();

    res.status(200).json({
      success: true,
      message: "Skills retrieved successfully",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve skills",
    });
  }
};

const getActiveSkills = async (
  _req: Request,
  res: Response
) => {
  try {
    const skills =
      await skillService.getActiveSkills();

    res.status(200).json({
      success: true,
      message:
        "Active skills retrieved successfully",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve active skills",
    });
  }
};

const getSkillsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const skills =
      await skillService.getSkillsByCategory(
        req.params.category as string
      );

    res.status(200).json({
      success: true,
      message:
        "Skills by category retrieved successfully",
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve skills",
    });
  }
};

const getSkillById = async (
  req: Request,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id  as string)) {
      throw new Error("Invalid skill ID");
    }

    const skill =
      await skillService.getSkillById(
        req.params.id  as string
      );

    res.status(200).json({
      success: true,
      message: "Skill retrieved successfully",
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve skill",
    });
  }
};

const getSkillBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const skill =
      await skillService.getSkillBySlug(
        req.params.slug as string
      );

    res.status(200).json({
      success: true,
      message: "Skill retrieved successfully",
      data: skill,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Skill not found",
    });
  }
};

const updateSkill = async (
  req: Request,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id as string)) {
      throw new Error("Invalid skill ID");
    }

    const skill =
      await skillService.updateSkill(
        req.params.id as string,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update skill",
    });
  }
};

const deleteSkill = async (
  req: Request,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id as string)) {
      throw new Error("Invalid skill ID");
    }

    const skill =
      await skillService.deleteSkill(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete skill",
    });
  }
};

export const skillController = {
  createSkill,
  getAllSkills,
  getActiveSkills,
  getSkillsByCategory,
  getSkillById,
  getSkillBySlug,
  updateSkill,
  deleteSkill,
};