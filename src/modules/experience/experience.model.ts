import { Schema, model } from "mongoose";

import { IExperience } from "./experience.interface";

const experienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },

    employmentType: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    technologies: {
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

experienceSchema.index({
  company: "text",
  position: "text",
  description: "text",
});

experienceSchema.index({
  isActive: 1,
  order: 1,
  startDate: -1,
});

export const ExperienceModel = model<IExperience>(
  "Experience",
  experienceSchema
);