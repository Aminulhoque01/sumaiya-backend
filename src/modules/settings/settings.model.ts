import mongoose, { Schema } from "mongoose";

import {
  ISiteSettingsDocument,
  ISocialLinks,
} from "./settings.interface";

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    facebook: {
      type: String,
      trim: true,
      default: "",
    },

    instagram: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    behance: {
      type: String,
      trim: true,
      default: "",
    },

    dribbble: {
      type: String,
      trim: true,
      default: "",
    },

    pinterest: {
      type: String,
      trim: true,
      default: "",
    },

    youtube: {
      type: String,
      trim: true,
      default: "",
    },

    twitter: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const settingsSchema =
  new Schema<ISiteSettingsDocument>(
    {
      siteName: {
        type: String,
        required: true,
        trim: true,
      },

      logo: {
        type: String,
        trim: true,
        default: "",
      },

      favicon: {
        type: String,
        trim: true,
        default: "",
      },

      tagline: {
        type: String,
        trim: true,
        default: "",
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        default: "",
      },

      whatsapp: {
        type: String,
        trim: true,
        default: "",
      },

      location: {
        type: String,
        trim: true,
        default: "",
      },

      socialLinks: {
        type: socialLinksSchema,
        default: {},
      },

      resumeUrl: {
        type: String,
        trim: true,
        default: "",
      },

      availabilityStatus: {
        type: String,
        enum: [
          "AVAILABLE",
          "BUSY",
          "UNAVAILABLE",
        ],
        default: "AVAILABLE",
      },

      footerText: {
        type: String,
        trim: true,
        default: "",
      },

      copyrightText: {
        type: String,
        trim: true,
        default: "",
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export const SettingsModel =
  mongoose.model<ISiteSettingsDocument>(
    "SiteSettings",
    settingsSchema
  );