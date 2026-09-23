import { Types } from "mongoose";

import {
  ICreateSkillPayload,
  IUpdateSkillPayload,
} from "./skill.interface";

import { SkillModel } from "./skill.model";
import { generateSlug } from "../../utils/slug";

 

const createSkill = async (
  payload: ICreateSkillPayload
) => {
  const slug = payload.slug
    ? generateSlug(payload.slug)
    : generateSlug(payload.name);

  const existingSkill = await SkillModel.findOne({
    slug,
  });

  if (existingSkill) {
    throw new Error(
      "A skill with this slug already exists"
    );
  }

  if (
    payload.proficiency !== undefined &&
    (payload.proficiency < 0 ||
      payload.proficiency > 100)
  ) {
    throw new Error(
      "Proficiency must be between 0 and 100"
    );
  }

  const skill = await SkillModel.create({
    name: payload.name,
    slug,

    category: payload.category,

    icon: payload.icon,

    proficiency: payload.proficiency,
    experience: payload.experience,

    order: payload.order ?? 0,
    isActive: payload.isActive ?? true,
  });

  return skill;
};

const getAllSkills = async () => {
  return SkillModel.find().sort({
    order: 1,
    createdAt: -1,
  });
};

const getActiveSkills = async () => {
  return SkillModel.find({
    isActive: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });
};

const getSkillsByCategory = async (
  category: string
) => {
  return SkillModel.find({
    category: category.trim(),
    isActive: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });
};

const getSkillById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid skill ID");
  }

  const skill = await SkillModel.findById(id);

  if (!skill) {
    throw new Error("Skill not found");
  }

  return skill;
};

const getSkillBySlug = async (
  slug: string
) => {
  const skill = await SkillModel.findOne({
    slug: slug.toLowerCase(),
  });

  if (!skill) {
    throw new Error("Skill not found");
  }

  return skill;
};

const updateSkill = async (
  id: string,
  payload: IUpdateSkillPayload
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid skill ID");
  }

  const skill = await SkillModel.findById(id);

  if (!skill) {
    throw new Error("Skill not found");
  }

  if (payload.proficiency !== undefined) {
    if (
      payload.proficiency < 0 ||
      payload.proficiency > 100
    ) {
      throw new Error(
        "Proficiency must be between 0 and 100"
      );
    }
  }

  if (payload.slug || payload.name) {
    const newSlug = payload.slug
      ? generateSlug(payload.slug)
      : generateSlug(payload.name as string);

    const existingSkill = await SkillModel.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });

    if (existingSkill) {
      throw new Error(
        "A skill with this slug already exists"
      );
    }

    payload.slug = newSlug;
  }

  Object.assign(skill, payload);

  await skill.save();

  return skill;
};

const deleteSkill = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid skill ID");
  }

  const skill = await SkillModel.findById(id);

  if (!skill) {
    throw new Error("Skill not found");
  }

  await SkillModel.findByIdAndDelete(id);

  return skill;
};

export const skillService = {
  createSkill,
  getAllSkills,
  getActiveSkills,
  getSkillsByCategory,
  getSkillById,
  getSkillBySlug,
  updateSkill,
  deleteSkill,
};