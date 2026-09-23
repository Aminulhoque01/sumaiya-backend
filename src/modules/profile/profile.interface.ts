import { Document } from "mongoose";

export interface IProfileImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface ISocialLinks {
  behance?: string;
  dribbble?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface IProfile extends Document {
  name: string;
  title: string;

  shortBio?: string;
  bio?: string;

  profileImage?: IProfileImage;
  coverImage?: IProfileImage;

  location?: string;
  email?: string;
  phone?: string;
  website?: string;

  availability?: string;
  yearsOfExperience?: number;

  resumeUrl?: string;

  socialLinks?: ISocialLinks;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProfilePayload {
  name: string;
  title: string;

  shortBio?: string;
  bio?: string;

  location?: string;
  email?: string;
  phone?: string;
  website?: string;

  availability?: string;
  yearsOfExperience?: number;

  resumeUrl?: string;

  socialLinks?: ISocialLinks;

  isActive?: boolean;
}

export interface IUpdateProfilePayload {
  name?: string;
  title?: string;

  shortBio?: string;
  bio?: string;

  location?: string;
  email?: string;
  phone?: string;
  website?: string;

  availability?: string;
  yearsOfExperience?: number;

  resumeUrl?: string;

  socialLinks?: ISocialLinks;

  isActive?: boolean;
}