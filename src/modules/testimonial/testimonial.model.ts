import { Schema, model } from "mongoose";

import { ITestimonial } from "./testimonial.interface";

const testimonialAvatarSchema = new Schema(
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

const testimonialSchema =
  new Schema<ITestimonial>(
    {
      name: {
        type: String,
        required: [
          true,
          "Testimonial name is required",
        ],
        trim: true,
      },

      role: {
        type: String,
        trim: true,
      },

      company: {
        type: String,
        trim: true,
      },

      avatar: {
        type: testimonialAvatarSchema,
      },

      message: {
        type: String,
        required: [
          true,
          "Testimonial message is required",
        ],
        trim: true,
        maxlength: 1000,
      },

      rating: {
        type: Number,
        min: 1,
        max: 5,
      },

      project: {
        type: String,
        trim: true,
      },

      order: {
        type: Number,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

testimonialSchema.index({
  name: "text",
  company: "text",
  message: "text",
});

testimonialSchema.index({
  isActive: 1,
  isFeatured: 1,
  order: 1,
});

export const TestimonialModel =
  model<ITestimonial>(
    "Testimonial",
    testimonialSchema
  );