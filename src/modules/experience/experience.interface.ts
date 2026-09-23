import { Document } from "mongoose";

export interface IExperience extends Document {
  company: string;
  position: string;

  employmentType?: string;
  location?: string;

  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;

  description?: string;

  responsibilities: string[];
  technologies: string[];

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateExperiencePayload {
  company: string;
  position: string;

  employmentType?: string;
  location?: string;

  startDate: Date | string;
  endDate?: Date | string;
  isCurrent?: boolean;

  description?: string;

  responsibilities?: string[];
  technologies?: string[];

  order?: number;
  isActive?: boolean;
}

export interface IUpdateExperiencePayload {
  company?: string;
  position?: string;

  employmentType?: string;
  location?: string;

  startDate?: Date | string;
  endDate?: Date | string;
  isCurrent?: boolean;

  description?: string;

  responsibilities?: string[];
  technologies?: string[];

  order?: number;
  isActive?: boolean;
}