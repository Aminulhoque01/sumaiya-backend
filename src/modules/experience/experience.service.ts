import { Types } from "mongoose";

import {
  ICreateExperiencePayload,
  IUpdateExperiencePayload,
} from "./experience.interface";

import { ExperienceModel } from "./experience.model";

const createExperience = async (
  payload: ICreateExperiencePayload
) => {
  const startDate = new Date(payload.startDate);

  if (Number.isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }

  let endDate: Date | undefined;

  if (payload.endDate) {
    endDate = new Date(payload.endDate);

    if (Number.isNaN(endDate.getTime())) {
      throw new Error("Invalid end date");
    }
  }

  if (endDate && endDate < startDate) {
    throw new Error(
      "End date cannot be before start date"
    );
  }

  if (payload.isCurrent && endDate) {
    throw new Error(
      "Current experience should not have an end date"
    );
  }

  const experience =
    await ExperienceModel.create({
      company: payload.company,
      position: payload.position,

      employmentType:
        payload.employmentType,

      location: payload.location,

      startDate,
      endDate,

      isCurrent:
        payload.isCurrent ?? false,

      description:
        payload.description,

      responsibilities:
        payload.responsibilities ?? [],

      technologies:
        payload.technologies ?? [],

      order: payload.order ?? 0,

      isActive:
        payload.isActive ?? true,
    });

  return experience;
};

const getAllExperiences = async () => {
  return ExperienceModel.find().sort({
    order: 1,
    startDate: -1,
    createdAt: -1,
  });
};

const getActiveExperiences = async () => {
  return ExperienceModel.find({
    isActive: true,
  }).sort({
    order: 1,
    startDate: -1,
    createdAt: -1,
  });
};

const getExperienceById = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid experience ID"
    );
  }

  const experience =
    await ExperienceModel.findById(id);

  if (!experience) {
    throw new Error(
      "Experience not found"
    );
  }

  return experience;
};

const updateExperience = async (
  id: string,
  payload: IUpdateExperiencePayload
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid experience ID"
    );
  }

  const experience =
    await ExperienceModel.findById(id);

  if (!experience) {
    throw new Error(
      "Experience not found"
    );
  }

  let startDate = experience.startDate;
  let endDate = experience.endDate;

  if (payload.startDate !== undefined) {
    startDate = new Date(
      payload.startDate
    );

    if (Number.isNaN(startDate.getTime())) {
      throw new Error("Invalid start date");
    }
  }

  if (payload.endDate !== undefined) {
    if (payload.endDate === null) {
      endDate = undefined;
    } else {
      endDate = new Date(
        payload.endDate
      );

      if (Number.isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
      }
    }
  }

  const isCurrent =
    payload.isCurrent ??
    experience.isCurrent;

  if (endDate && endDate < startDate) {
    throw new Error(
      "End date cannot be before start date"
    );
  }

  if (isCurrent && endDate) {
    throw new Error(
      "Current experience should not have an end date"
    );
  }

  Object.assign(experience, {
    ...payload,
    startDate,
    endDate,
    isCurrent,
  });

  await experience.save();

  return experience;
};

const deleteExperience = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid experience ID"
    );
  }

  const experience =
    await ExperienceModel.findById(id);

  if (!experience) {
    throw new Error(
      "Experience not found"
    );
  }

  await ExperienceModel.findByIdAndDelete(id);

  return experience;
};

export const experienceService = {
  createExperience,
  getAllExperiences,
  getActiveExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};