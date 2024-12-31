import blog from '../models/blog.models.js';
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

// add blog 
const addBlog = async (req, res) => {
    const { title, description, userRef } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });
    if (!description) return res.status(400).json({ message: "description is required" });
    if (!userRef) return res.status(400).json({ message: "apna reference dein bahi kesa tu upload kar raha blog" });
    if (!req.file) return res.status(400).json({ message: "Please Upload Un Image" });
    try {
        const imageURL = await uploadImageToCloudinary(req.file.path);
        if (!imageURL) return res.status(500).json({ message: "Error Uploading An Image" });
        await blog.create({ title, description, imageURL, userRef })
        res.status(201).json({ message: "blog added successfully" })
    } catch (error) {
        res.status(500).json({ message: "error occurred" })
    }
}

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
