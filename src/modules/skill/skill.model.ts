import { Schema, model } from "mongoose";
import { ISkill } from "./skill.interface";

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Skill slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    category: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    proficiency: {
      type: Number,
      min: 0,
      max: 100,
    },

    experience: {
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
  },
  {
    timestamps: true,
  }
);

skillSchema.index({
  name: "text",
  category: "text",
});

skillSchema.index({
  category: 1,
  isActive: 1,
  order: 1,
});

export const SkillModel = model<ISkill>(
  "Skill",
  skillSchema
);