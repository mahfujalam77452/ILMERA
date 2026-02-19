import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `ilmera/${folder}`,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary delete failed: ${error.message}`);
  }
};

export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) return;
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
  } catch (error) {
    console.error(`Cloudinary bulk delete failed: ${error.message}`);
  }
};

export default cloudinary;
