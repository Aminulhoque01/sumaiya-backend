import { Schema, model } from "mongoose";
import { IProject } from "./project.interface";

const projectImageSchema = new Schema(
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
  },
);

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Project slug is required"],
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
      required: [true, "Project description is required"],
      trim: true,
    },

    thumbnail: {
      type: projectImageSchema,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Project category is required"],
    },

    tools: {
      type: [String],
      default: [],
    },

    client: {
      type: String,
      trim: true,
    },

    projectDate: {
      type: Date,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    projectUrl: {
      type: String,
      trim: true,
    },

    behanceUrl: {
      type: String,
      trim: true,
    },

    dribbbleUrl: {
      type: String,
      trim: true,
    },

    caseStudy: {
      overview: {
        type: String,
        trim: true,
      },

      challenge: {
        type: String,
        trim: true,
      },

      solution: {
        type: String,
        trim: true,
      },

      process: {
        type: String,
        trim: true,
      },

      result: {
        type: String,
        trim: true,
      },
    },

    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: 70,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 160,
      },

      keywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({
  title: "text",
  shortDescription: "text",
  description: "text",
});

projectSchema.index({
  category: 1,
  isPublished: 1,
  featured: 1,
});

projectSchema.index({
  order: 1,
  createdAt: -1,
});

export const ProjectModel = model<IProject>("Project", projectSchema);
