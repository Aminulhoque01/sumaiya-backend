import { Schema, model } from "mongoose";
import {
  ContactStatus,
  IContact,
} from "./contact.interface";

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    subject: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: {
        values: [
          "NEW",
          "READ",
          "REPLIED",
          "ARCHIVED",
        ] satisfies ContactStatus[],
        message: "Invalid contact status",
      },
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

contactSchema.index({
  status: 1,
  createdAt: -1,
});

contactSchema.index({
  email: 1,
  createdAt: -1,
});

export const ContactModel = model<IContact>(
  "Contact",
  contactSchema
);