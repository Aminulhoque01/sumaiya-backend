import { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}