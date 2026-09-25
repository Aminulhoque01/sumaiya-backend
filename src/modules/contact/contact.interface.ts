import { Document } from "mongoose";

export type ContactStatus =
  | "NEW"
  | "READ"
  | "REPLIED"
  | "ARCHIVED";

export interface IContactReply {
  message: string;
  sentAt: Date;
  messageId?: string;
}

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;

  status: ContactStatus;

  replies: IContactReply[];

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

export interface IReplyContactPayload {
  message: string;
}