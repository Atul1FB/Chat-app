import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;

    const response = await cloudinary.uploader.upload(file, {
      folder: "chat-app",
    });

    console.log("File uploaded:", response.secure_url);

    return response;
  } catch (error) {
    console.log("Cloudinary Error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary };