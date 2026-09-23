import { Document, Types } from "mongoose";

export interface IProjectImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;

  thumbnail?: IProjectImage;

  category: Types.ObjectId;

  tools: string[];

  client?: string;

  projectDate?: Date;

  featured: boolean;

  isPublished: boolean;

  order: number;

  projectUrl?: string;

  behanceUrl?: string;

  dribbbleUrl?: string;

  caseStudy?: {
    overview?: string;
    challenge?: string;
    solution?: string;
    process?: string;
    result?: string;
  };

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProjectPayload {
  title: string;

  slug?: string;

  shortDescription: string;

  description: string;

  category: string;

  tools?: string[];

  client?: string;

  projectDate?: string;

  featured?: boolean;

  isPublished?: boolean;

  order?: number;

  projectUrl?: string;

  behanceUrl?: string;

  dribbbleUrl?: string;

  caseStudy?: {
    overview?: string;
    challenge?: string;
    solution?: string;
    process?: string;
    result?: string;
  };

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface IUpdateProjectPayload {
  title?: string;

  slug?: string;

  shortDescription?: string;

  description?: string;

  category?: string;

  tools?: string[];

  client?: string;

  projectDate?: string;

  featured?: boolean;

  isPublished?: boolean;

  order?: number;

  projectUrl?: string;

  behanceUrl?: string;

  dribbbleUrl?: string;

  caseStudy?: {
    overview?: string;
    challenge?: string;
    solution?: string;
    process?: string;
    result?: string;
  };

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}