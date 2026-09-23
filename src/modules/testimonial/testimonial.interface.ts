import { Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  company?: string;

  avatar?: {
    url: string;
    publicId: string;
    alt?: string;
  };

  message: string;
  rating?: number;

  project?: string;

  order: number;
  isActive: boolean;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTestimonialPayload {
  name: string;
  role?: string;
  company?: string;

  message: string;
  rating?: number;

  project?: string;

  order?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface IUpdateTestimonialPayload {
  name?: string;
  role?: string;
  company?: string;

  message?: string;
  rating?: number;

  project?: string;

  order?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}