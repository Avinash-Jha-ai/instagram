import cloudinary from "../configs/cloudinary.js"



export const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "instagram_clone",
    resource_type: "auto", // 🔥 required for video
  });
};