import { Document } from "mongoose";

export interface IServiceImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IService extends Document {
  title: string;
  slug?: string;
  shortDescription: string;
  description?: string;

  icon?: string;
  image?: IServiceImage;

  features: string[];

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateServicePayload {
  title: string;
  slug?: string;
  shortDescription: string;
  description?: string;

  icon?: string;

  features?: string[];

  order?: number;
  isActive?: boolean;
}

export interface IUpdateServicePayload {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;

  icon?: string;

  features?: string[];

  order?: number;
  isActive?: boolean;
}