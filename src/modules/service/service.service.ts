import { Types } from "mongoose";

import { ServiceModel } from "./service.model";
import {
  ICreateServicePayload,
  IUpdateServicePayload,
} from "./service.interface";

 

import cloudinary from "../../config/cloudinary";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { generateSlug } from "../../utils/slug";

const createService = async (
  payload: ICreateServicePayload,
  imageFile?: Express.Multer.File
) => {
  const slug = payload.slug
    ? generateSlug(payload.slug)
    : generateSlug(payload.title);

  const existingService = await ServiceModel.findOne({
    slug,
  });

  if (existingService) {
    throw new Error(
      "A service with this slug already exists"
    );
  }

  let uploadedImage:
    | {
        url: string;
        publicId: string;
        alt?: string;
      }
    | undefined;

  try {
    // Upload image to Cloudinary
    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        "sumaiya-portfolio/services"
      );

      uploadedImage = {
        url: result.secure_url,
        publicId: result.public_id,
        alt: payload.title,
      };
    }

    const service = await ServiceModel.create({
      title: payload.title,
      slug,

      shortDescription: payload.shortDescription,
      description: payload.description,

      icon: payload.icon,

      image: uploadedImage,

      features: payload.features || [],

      order: payload.order ?? 0,
      isActive: payload.isActive ?? true,
    });

    return service;
  } catch (error) {
    // If database creation fails,
    // remove already uploaded Cloudinary image
    if (uploadedImage?.publicId) {
      await cloudinary.uploader.destroy(
        uploadedImage.publicId,
        {
          resource_type: "image",
        }
      );
    }

    throw error;
  }
};

const getAllServices = async () => {
  return ServiceModel.find().sort({
    order: 1,
    createdAt: -1,
  });
};

const getActiveServices = async () => {
  return ServiceModel.find({
    isActive: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });
};

const getServiceById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid service ID");
  }

  const service = await ServiceModel.findById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

const getServiceBySlug = async (slug: string) => {
  const service = await ServiceModel.findOne({
    slug: slug.toLowerCase(),
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

const updateService = async (
  id: string,
  payload: IUpdateServicePayload,
  imageFile?: Express.Multer.File
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid service ID");
  }

  const service = await ServiceModel.findById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  // Update slug
  if (payload.slug || payload.title) {
    const newSlug = payload.slug
      ? generateSlug(payload.slug)
      : generateSlug(payload.title as string);

    const existingService = await ServiceModel.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });

    if (existingService) {
      throw new Error(
        "A service with this slug already exists"
      );
    }

    payload.slug = newSlug;
  }

  let newImage:
    | {
        url: string;
        publicId: string;
        alt?: string;
      }
    | undefined;

  const oldImagePublicId = service.image?.publicId;

  try {
    // Upload new image if provided
    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile.buffer,
        "sumaiya-portfolio/services"
      );

      newImage = {
        url: result.secure_url,
        publicId: result.public_id,
        alt: payload.title || service.title,
      };

      service.image = newImage;
    }

    Object.assign(service, payload);

    await service.save();

    // Delete old image only after database update succeeds
    if (
      imageFile &&
      oldImagePublicId &&
      newImage?.publicId !== oldImagePublicId
    ) {
      await cloudinary.uploader.destroy(
        oldImagePublicId,
        {
          resource_type: "image",
        }
      );
    }

    return service;
  } catch (error) {
    // If new image was uploaded but DB update failed,
    // remove new image from Cloudinary
    if (
      newImage?.publicId &&
      newImage.publicId !== oldImagePublicId
    ) {
      await cloudinary.uploader.destroy(
        newImage.publicId,
        {
          resource_type: "image",
        }
      );
    }

    throw error;
  }
};

const deleteService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid service ID");
  }

  const service = await ServiceModel.findById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  // Delete image from Cloudinary
  if (service.image?.publicId) {
    await cloudinary.uploader.destroy(
      service.image.publicId,
      {
        resource_type: "image",
      }
    );
  }

  // Delete service from MongoDB
  await ServiceModel.findByIdAndDelete(id);

  return service;
};

export const serviceService = {
  createService,
  getAllServices,
  getActiveServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
};