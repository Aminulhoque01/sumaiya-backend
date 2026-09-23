import { Schema, model } from "mongoose";
import { IProfile } from "./profile.interface";
 

const profileImageSchema = new Schema(
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
  { _id: false }
);

const socialLinksSchema = new Schema(
  {
    behance: {
      type: String,
      trim: true,
    },
    dribbble: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    youtube: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: [true, "Profile name is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Profile title is required"],
      trim: true,
    },

    shortBio: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    profileImage: {
      type: profileImageSchema,
    },

    coverImage: {
      type: profileImageSchema,
    },

    location: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    availability: {
      type: String,
      trim: true,
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    socialLinks: {
      type: socialLinksSchema,
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

profileSchema.index({
  name: "text",
  title: "text",
  shortBio: "text",
  bio: "text",
});

profileSchema.index({
  isActive: 1,
});

export const ProfileModel = model<IProfile>("Profile", profileSchema);