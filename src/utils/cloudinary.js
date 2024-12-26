import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (localPath) => {
    try {
        const result = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localPath);
        return result.url;
    } catch (err) {
        return fs.unlinkSync(localPath);
    };
};