import { Request, Response } from "express";

import {
  ICreateProjectPayload,
  IUpdateProjectPayload,
} from "./project.interface";

import { projectService } from "./project.service";

const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = JSON.parse(req.body.data);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const thumbnailFile = files?.thumbnail?.[0];

    const galleryFiles = files?.gallery || [];

    const project =
      await projectService.createProject(
        payload,
        thumbnailFile,
        galleryFiles
      );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create project",
    });
  }
};

const getAllProjects = async (
  _req: Request,
  res: Response
) => {
  try {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve projects",
    });
  }
};

const getPublishedProjects = async (
  _req: Request,
  res: Response
) => {
  try {
    const projects =
      await projectService.getPublishedProjects();

    res.status(200).json({
      success: true,
      message: "Published projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve projects",
    });
  }
};

const getFeaturedProjects = async (
  _req: Request,
  res: Response
) => {
  try {
    const projects =
      await projectService.getFeaturedProjects();

    res.status(200).json({
      success: true,
      message: "Featured projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve featured projects",
    });
  }
};

const getProjectsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryId } = req.params;

    const projects =
      await projectService.getProjectsByCategory(
        categoryId as string
      );

    res.status(200).json({
      success: true,
      message: "Category projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve category projects",
    });
  }
};

const getProjectById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const project =
      await projectService.getProjectById(id as string);

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Project not found",
    });
  }
};

const getProjectBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const project =
      await projectService.getProjectBySlug(slug as string);

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Project not found",
    });
  }
};

const updateProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const payload =
      req.body as IUpdateProjectPayload;

    const project =
      await projectService.updateProject(
        id as string,
        payload
      );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update project",
    });
  }
};

const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await projectService.deleteProject(id as string);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete project",
    });
  }
};

export const projectController = {
  createProject,
  getAllProjects,
  getPublishedProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
};