import { Types } from "mongoose";

import {
  ICreateTestimonialPayload,
  IUpdateTestimonialPayload,
} from "./testimonial.interface";

import { TestimonialModel } from "./testimonial.model";

import { uploadToCloudinary } from "../../utils/cloudinary";
import cloudinary from "../../config/cloudinary";

const createTestimonial = async (
  payload: ICreateTestimonialPayload,
  avatarFile?: Express.Multer.File
) => {
  let avatar:
    | {
        url: string;
        publicId: string;
        alt?: string;
      }
    | undefined;

  let uploadedPublicId: string | undefined;

  try {
    if (avatarFile) {
      const uploadResult =
        await uploadToCloudinary(
          avatarFile.buffer,
          "sumaiya-portfolio/testimonials"
        );

      avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt: payload.name,
      };

      uploadedPublicId =
        uploadResult.public_id;
    }

    if (
      payload.rating !== undefined &&
      (payload.rating < 1 ||
        payload.rating > 5)
    ) {
      throw new Error(
        "Rating must be between 1 and 5"
      );
    }

    const testimonial =
      await TestimonialModel.create({
        name: payload.name,
        role: payload.role,
        company: payload.company,

        avatar,

        message: payload.message,
        rating: payload.rating,

        project: payload.project,

        order: payload.order ?? 0,

        isActive:
          payload.isActive ?? true,

        isFeatured:
          payload.isFeatured ?? false,
      });

    return testimonial;
  } catch (error) {
    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(
          uploadedPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup Cloudinary image:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const getAllTestimonials = async () => {
  return TestimonialModel.find().sort({
    order: 1,
    createdAt: -1,
  });
};

const getActiveTestimonials = async () => {
  return TestimonialModel.find({
    isActive: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });
};

const getFeaturedTestimonials = async () => {
  return TestimonialModel.find({
    isActive: true,
    isFeatured: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });
};

const getTestimonialById = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid testimonial ID"
    );
  }

  const testimonial =
    await TestimonialModel.findById(id);

  if (!testimonial) {
    throw new Error(
      "Testimonial not found"
    );
  }

  return testimonial;
};

const updateTestimonial = async (
  id: string,
  payload: IUpdateTestimonialPayload,
  avatarFile?: Express.Multer.File
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid testimonial ID"
    );
  }

  const testimonial =
    await TestimonialModel.findById(id);

  if (!testimonial) {
    throw new Error(
      "Testimonial not found"
    );
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 ||
      payload.rating > 5)
  ) {
    throw new Error(
      "Rating must be between 1 and 5"
    );
  }

  let newAvatarPublicId:
    | string
    | undefined;

  const oldAvatarPublicId =
    testimonial.avatar?.publicId;

  try {
    if (avatarFile) {
      const uploadResult =
        await uploadToCloudinary(
          avatarFile.buffer,
          "sumaiya-portfolio/testimonials"
        );

      testimonial.avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt:
          payload.name ??
          testimonial.name,
      };

      newAvatarPublicId =
        uploadResult.public_id;
    }

    Object.assign(testimonial, {
      ...payload,
    });

    await testimonial.save();

    if (
      newAvatarPublicId &&
      oldAvatarPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldAvatarPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to delete old Cloudinary image:",
          cleanupError
        );
      }
    }

    return testimonial;
  } catch (error) {
    if (newAvatarPublicId) {
      try {
        await cloudinary.uploader.destroy(
          newAvatarPublicId,
          {
            resource_type: "image",
          }
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup new Cloudinary image:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

const deleteTestimonial = async (
  id: string
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid testimonial ID"
    );
  }

  const testimonial =
    await TestimonialModel.findById(id);

  if (!testimonial) {
    throw new Error(
      "Testimonial not found"
    );
  }

  if (testimonial.avatar?.publicId) {
    try {
      await cloudinary.uploader.destroy(
        testimonial.avatar.publicId,
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      console.error(
        "Failed to delete testimonial avatar from Cloudinary:",
        error
      );
    }
  }

  await TestimonialModel.findByIdAndDelete(
    id
  );

  return testimonial;
};

export const testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getActiveTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};