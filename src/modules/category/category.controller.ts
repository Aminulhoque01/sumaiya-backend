import { Request, Response } from "express";

import { categoryService } from "./category.service";

const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await categoryService.createCategory(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
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

const getAllCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const result =
      await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

const getActiveCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const result =
      await categoryService.getActiveCategories();

    res.status(200).json({
      success: true,
      message:
        "Active categories retrieved successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

const getCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await categoryService.getCategoryById(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
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

const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await categoryService.updateCategory(
        req.params.id  as string,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
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

const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await categoryService.deleteCategory(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
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

export const categoryController = {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};