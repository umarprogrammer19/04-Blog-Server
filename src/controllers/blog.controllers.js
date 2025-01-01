import blog from '../models/blog.models.js';
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

// add blog 
const addBlog = async (req, res) => {
    const { title, description } = req.body;

    // Validate the input
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });
    if (!req.user) return res.status(401).json({ message: "User Unauthorized" });
    try {
        const userRef = req.user;
        if (!userRef) return res.status(401).json({ message: "PLease Login First" });
        const imageURL = await uploadImageToCloudinary(req.file.path);
        if (!imageURL) {
            return res.status(500).json({ message: "Error uploading the image" });
        }
        await blog.create({ title, description, imageURL, userRef: userRef._id });
        res.status(201).json({ message: "Blog added successfully" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "An error occurred" });
    }
};

// delete blog 
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" })
    try {
        const blogFound = await blog.findByIdAndDelete(id)
        if (!blogFound) return res.status(404).json({ message: "no blog found !" })
        res.status(200).json({ message: "blog deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "error occurred" })
    }
}

// edit blog 
const editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!id) return res.status(400).json({ message: "id is required" })
    try {
        const blogFound = await blog.findByIdAndUpdate(id, { title, description })
        if (!blogFound) return res.status(404).json({ message: "no blog found !" })
        res.status(200).json({ message: "blog edit successfully" })
    } catch (error) {
        res.status(500).json({ message: "error occurred" })
    }
}

// get all blog
const allBlog = async (req, res) => {
    try {
        const blogs = await blog.find({})
        res.status(200).json({ message: "fetch all blog", blogs })
    } catch (error) {
        res.status(500).json({
            message: "error occurred",
            error: error.message
        })
    }
}

// get single blog 
const singleBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await blog.findById(id)
        res.status(200).json({ message: user })
    } catch (error) {
        res.status(500).json({
            message: "error occurred",
            error: error.message
        })
    }
}




export { addBlog, allBlog, deleteBlog, editBlog, singleBlog };

