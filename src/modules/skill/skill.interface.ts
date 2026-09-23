import { Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  slug: string;
  category: string;

  icon?: string;

  proficiency?: number;
  experience?: string;

  order: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSkillPayload {
  name: string;
  slug?: string;
  category: string;

  icon?: string;

  proficiency?: number;
  experience?: string;

  order?: number;
  isActive?: boolean;
}

export interface IUpdateSkillPayload {
  name?: string;
  slug?: string;
  category?: string;

  icon?: string;

  proficiency?: number;
  experience?: string;

  order?: number;
  isActive?: boolean;
}