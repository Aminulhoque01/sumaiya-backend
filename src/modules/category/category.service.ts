import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

import { CategoryModel } from "./category.model";

import { generateSlug } from "../../utils/slug";

const createCategory = async (
  payload: ICreateCategoryPayload
) => {
  const slug = payload.slug
    ? generateSlug(payload.slug)
    : generateSlug(payload.name);

  const existingCategory = await CategoryModel.findOne({
    $or: [
      { name: payload.name.trim() },
      { slug },
    ],
  });

  if (existingCategory) {
    throw new Error(
      "Category with this name or slug already exists"
    );
  }

  const category = await CategoryModel.create({
    ...payload,
    name: payload.name.trim(),
    slug,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await CategoryModel.find()
    .sort({ createdAt: -1 });

  return categories;
};

const getActiveCategories = async () => {
  const categories = await CategoryModel.find({
    isActive: true,
  }).sort({ name: 1 });

  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: IUpdateCategoryPayload
) => {
  const updateData: IUpdateCategoryPayload = {
    ...payload,
  };

  if (payload.name) {
    updateData.name = payload.name.trim();

    if (!payload.slug) {
      updateData.slug = generateSlug(payload.name);
    }
  }

  if (payload.slug) {
    updateData.slug = generateSlug(payload.slug);
  }

  const category = await CategoryModel.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const deleteCategory = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};