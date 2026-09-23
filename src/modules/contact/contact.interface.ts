import { Document } from "mongoose";

export type ContactStatus =
  | "NEW"
  | "READ"
  | "REPLIED"
  | "ARCHIVED";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;

  status: ContactStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface IUpdateContactPayload {
  status?: ContactStatus;
}