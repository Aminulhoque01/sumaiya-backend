import { Schema, model } from "mongoose";

import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<ICategory>(
  "Category",
  categorySchema
);