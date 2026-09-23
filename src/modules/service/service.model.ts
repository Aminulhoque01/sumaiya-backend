import { Schema, model } from "mongoose";
import { IService } from "./service.interface";

const serviceImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Service slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    image: {
      type: serviceImageSchema,
    },

    features: {
      type: [String],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({
  title: "text",
  shortDescription: "text",
  description: "text",
});

serviceSchema.index({
  isActive: 1,
  order: 1,
});

export const ServiceModel = model<IService>(
  "Service",
  serviceSchema
);