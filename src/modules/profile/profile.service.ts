import { Types } from "mongoose";
import {
  ICreateProfilePayload,
  IUpdateProfilePayload,
} from "./profile.interface";
import { ProfileModel } from "./profile.model";
import {
  ICloudinaryUploadResult,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import cloudinary from "../../config/cloudinary";

const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary image: ${publicId}`,
      error
    );
  }
};

const createProfile = async (
  payload: ICreateProfilePayload,
  profileImageBuffer?: Buffer,
  coverImageBuffer?: Buffer
) => {
  const existingProfile = await ProfileModel.findOne();

  if (existingProfile) {
    throw new Error(
      "Profile already exists. Use update profile instead."
    );
  }

  let uploadedProfileImage:
    | ICloudinaryUploadResult
    | undefined;

  let uploadedCoverImage:
    | ICloudinaryUploadResult
    | undefined;

  try {
    if (profileImageBuffer) {
      uploadedProfileImage = await uploadToCloudinary(
        profileImageBuffer,
        "sumaiya-portfolio/profile"
      );
    }

    if (coverImageBuffer) {
      uploadedCoverImage = await uploadToCloudinary(
        coverImageBuffer,
        "sumaiya-portfolio/profile"
      );
    }

    const profile = await ProfileModel.create({
      ...payload,

      profileImage: uploadedProfileImage
        ? {
            url: uploadedProfileImage.secure_url,
            publicId: uploadedProfileImage.public_id,
          }
        : undefined,

      coverImage: uploadedCoverImage
        ? {
            url: uploadedCoverImage.secure_url,
            publicId: uploadedCoverImage.public_id,
          }
        : undefined,
    });

    return profile;
  } catch (error) {
    if (uploadedProfileImage?.public_id) {
      await deleteFromCloudinary(
        uploadedProfileImage.public_id
      );
    }

    if (uploadedCoverImage?.public_id) {
      await deleteFromCloudinary(
        uploadedCoverImage.public_id
      );
    }

    throw error;
  }
};

const getProfile = async () => {
  const profile = await ProfileModel.findOne({
    isActive: true,
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

const getProfileForAdmin = async () => {
  const profile = await ProfileModel.findOne();

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

const updateProfile = async (
  payload: IUpdateProfilePayload,
  profileImageBuffer?: Buffer,
  coverImageBuffer?: Buffer
) => {
  const profile = await ProfileModel.findOne();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const oldProfileImage = profile.profileImage;
  const oldCoverImage = profile.coverImage;

  let newProfileImage:
    | ICloudinaryUploadResult
    | undefined;

  let newCoverImage:
    | ICloudinaryUploadResult
    | undefined;

  try {
    if (profileImageBuffer) {
      newProfileImage = await uploadToCloudinary(
        profileImageBuffer,
        "sumaiya-portfolio/profile"
      );
    }

    if (coverImageBuffer) {
      newCoverImage = await uploadToCloudinary(
        coverImageBuffer,
        "sumaiya-portfolio/profile"
      );
    }

    Object.assign(profile, payload);

    if (newProfileImage) {
      profile.profileImage = {
        url: newProfileImage.secure_url,
        publicId: newProfileImage.public_id,
      };
    }

    if (newCoverImage) {
      profile.coverImage = {
        url: newCoverImage.secure_url,
        publicId: newCoverImage.public_id,
      };
    }

    await profile.save();

    if (
      newProfileImage &&
      oldProfileImage?.publicId
    ) {
      await deleteFromCloudinary(
        oldProfileImage.publicId
      );
    }

    if (
      newCoverImage &&
      oldCoverImage?.publicId
    ) {
      await deleteFromCloudinary(
        oldCoverImage.publicId
      );
    }

    return profile;
  } catch (error) {
    if (newProfileImage?.public_id) {
      await deleteFromCloudinary(
        newProfileImage.public_id
      );
    }

    if (newCoverImage?.public_id) {
      await deleteFromCloudinary(
        newCoverImage.public_id
      );
    }

    throw error;
  }
};

const deleteProfile = async () => {
  const profile = await ProfileModel.findOne();

  if (!profile) {
    throw new Error("Profile not found");
  }

  if (profile.profileImage?.publicId) {
    await deleteFromCloudinary(
      profile.profileImage.publicId
    );
  }

  if (profile.coverImage?.publicId) {
    await deleteFromCloudinary(
      profile.coverImage.publicId
    );
  }

  await ProfileModel.findByIdAndDelete(profile._id);

  return profile;
};

const getProfileById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid profile ID");
  }

  const profile = await ProfileModel.findById(id);

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

export const profileService = {
  createProfile,
  getProfile,
  getProfileForAdmin,
  updateProfile,
  deleteProfile,
  getProfileById,
};