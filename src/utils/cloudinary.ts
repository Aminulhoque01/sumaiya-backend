import { v2 as cloudinary } from "cloudinary";

export interface ICloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<ICloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    );

    uploadStream.end(buffer);
  });
};