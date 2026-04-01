import cloudinary from "../configs/cloudinary.js"
import fs from "fs"

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "instagram_clone",
      resource_type: "auto", // 🔥 required for video
    });
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};