import { Types } from "mongoose";

import {
  ICreateProjectPayload,
  IUpdateProjectPayload,
} from "./project.interface";

import { ProjectModel } from "./project.model";
import { CategoryModel } from "../category/category.model";

 

import { uploadToCloudinary } from "../../utils/cloudinary";

import cloudinary from "../../config/cloudinary";
import { generateSlug } from "../../utils/slug";

const createProject = async (
  payload: ICreateProjectPayload,
  thumbnailFile?: Express.Multer.File,
  galleryFiles: Express.Multer.File[] = []
) => {
  const slug = payload.slug
    ? generateSlug(payload.slug)
    : generateSlug(payload.title);

  const existingProject = await ProjectModel.findOne({
    slug,
  });

  if (existingProject) {
    throw new Error(
      "A project with this slug already exists"
    );
  }

  if (!Types.ObjectId.isValid(payload.category)) {
    throw new Error("Invalid category ID");
  }

  const categoryExists = await CategoryModel.findById(
    payload.category
  );

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const uploadedPublicIds: string[] = [];

  try {
    let thumbnail;

    // Upload thumbnail
    if (thumbnailFile) {
      const result = await uploadToCloudinary(
        thumbnailFile.buffer,
        "sumaiya-portfolio/projects/thumbnails"
      );

      thumbnail = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      uploadedPublicIds.push(result.public_id);
    }

    // Upload gallery
    const gallery = [];

    for (const file of galleryFiles) {
      const result = await uploadToCloudinary(
        file.buffer,
        "sumaiya-portfolio/projects/gallery"
      );

      gallery.push({
        url: result.secure_url,
        publicId: result.public_id,
      });

      uploadedPublicIds.push(result.public_id);
    }

    const project = await ProjectModel.create({
      title: payload.title,
      slug,

      shortDescription: payload.shortDescription,
      description: payload.description,

      thumbnail,
      

      category: payload.category,

      tools: payload.tools || [],

      client: payload.client,
      projectDate: payload.projectDate,

      featured: payload.featured ?? false,
      isPublished: payload.isPublished ?? true,
      order: payload.order ?? 0,

      projectUrl: payload.projectUrl,
      behanceUrl: payload.behanceUrl,
      dribbbleUrl: payload.dribbbleUrl,

      caseStudy: payload.caseStudy,

      seo: payload.seo,
    });

    return project.populate("category", "name slug");
  } catch (error) {
    // Cleanup Cloudinary uploads if DB operation fails
    if (uploadedPublicIds.length > 0) {
      await Promise.allSettled(
        uploadedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );
    }

    throw error;
  }
};

const getAllProjects = async () => {
  return ProjectModel.find()
    .populate("category", "name slug")
    .sort({
      order: 1,
      createdAt: -1,
    });
};

const getPublishedProjects = async () => {
  return ProjectModel.find({
    isPublished: true,
  })
    .populate("category", "name slug")
    .sort({
      order: 1,
      createdAt: -1,
    });
};

const getFeaturedProjects = async () => {
  return ProjectModel.find({
    isPublished: true,
    featured: true,
  })
    .populate("category", "name slug")
    .sort({
      order: 1,
      createdAt: -1,
    });
};

const getProjectsByCategory = async (
  categoryId: string
) => {
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  return ProjectModel.find({
    category: categoryId,
    isPublished: true,
  })
    .populate("category", "name slug")
    .sort({
      order: 1,
      createdAt: -1,
    });
};

const getProjectById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findById(id).populate(
    "category",
    "name slug"
  );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

const getProjectBySlug = async (slug: string) => {
  const project = await ProjectModel.findOne({
    slug: generateSlug(slug),
  }).populate("category", "name slug");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

const updateProject = async (
  id: string,
  payload: IUpdateProjectPayload
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid project ID");
  }

  const existingProject = await ProjectModel.findById(id);

  if (!existingProject) {
    throw new Error("Project not found");
  }

  let updateData = {
    ...payload,
  };

  if (payload.title && !payload.slug) {
    updateData = {
      ...updateData,
      slug: generateSlug(payload.title),
    };
  }

  if (payload.slug) {
    updateData = {
      ...updateData,
      slug: generateSlug(payload.slug),
    };
  }

  if (payload.category) {
    if (!Types.ObjectId.isValid(payload.category)) {
      throw new Error("Invalid category ID");
    }

    const categoryExists = await CategoryModel.findById(
      payload.category
    );

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  if (updateData.slug) {
    const duplicateProject = await ProjectModel.findOne({
      slug: updateData.slug,
      _id: {
        $ne: id,
      },
    });

    if (duplicateProject) {
      throw new Error(
        "A project with this slug already exists"
      );
    }
  }

  return ProjectModel.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name slug");
};

const deleteProject = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  // Delete thumbnail from Cloudinary
  if (project.thumbnail?.publicId) {
    console.log(
      "Deleting thumbnail:",
      project.thumbnail.publicId
    );

    const thumbnailResult = await cloudinary.uploader.destroy(
      project.thumbnail.publicId,
      {
        resource_type: "image",
      }
    );

    console.log(
      "Thumbnail Cloudinary response:",
      thumbnailResult
    );
  }

  

  await ProjectModel.findByIdAndDelete(id);

  return project;
};

export const projectService = {
  createProject,
  getAllProjects,
  getPublishedProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
};