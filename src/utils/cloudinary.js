import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (localPath) => {
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

export const uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({
        message: "no image file uploaded",
    });

    try {
        const uploadResult = await uploadImageToCloudinary(req.file.path);
        if (!uploadResult) return res.status(500).json({
            message: "error occured while uploading image"
        });

        res.json({
            message: "image uploaded successfully",
            url: uploadResult,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "error occured while uploading image" });
    }
} 