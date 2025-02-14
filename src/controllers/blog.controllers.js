import mongoose from 'mongoose';
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

const deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    if (!blogId) {
        return res.status(400).json({ message: "Blog ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: "Invalid Blog ID." });
    }

    if (!req.user) {
        return res.status(401).json({ message: "You need to log in first." });
    }

    try {
        const blogFound = await blog.findByIdAndDelete(blogId);
        if (!blogFound) {
            return res.status(404).json({ message: "No blog found with this ID." });
        }

        res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "An error occurred while deleting the blog." });
    }
};

export default deleteBlog;

// edit blog 
const editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Blog ID is required." });
    }
    if (!title && !description && !req.file) {
        return res.status(400).json({ message: "Please provide at least one field to update (title, description, or image)." });
    }
    if (!req.user) {
        return res.status(401).json({ message: "You need to log in first." });
    }
    try {
        let imageURL = null;
        if (req.file) {
            imageURL = await uploadImageToCloudinary(req.file.path);
            if (!imageURL) {
                return res.status(500).json({ message: "Error uploading the image. Please try again." });
            }
        }
        const updatedBlog = await blog.findByIdAndUpdate(
            id,
            {
                title: title || undefined,
                description: description || undefined,
                imageURL: imageURL || undefined,
            },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "No blog found with this ID." });
        }

        res.status(200).json({ message: "Blog edited successfully", blog: updatedBlog });
    } catch (error) {
        console.log("Error editing blog:", error);
        res.status(500).json({ message: "An error occurred while editing the blog. Please try again later." });
    }
};

// get all blog
const allBlog = async (req, res) => {
    try {
        const blogs = await blog.find({})
            .populate("userRef", "_id fullname email").populate("comments")

        // Add the likes count to each blog
        const blogsWithLikesCount = blogs.map(blog => ({
            ...blog.toObject(),
            likesCount: blog.like.length,
        }));

        res.status(200).json({
            message: "Fetched all blogs",
            blogs: blogsWithLikesCount,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred",
            error: error.message,
        });
    }
};

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

const userAllBlog = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "User Unauthorized" });
    try {
        const { _id } = req.user;
        if (!_id) return res.status(400).json({ message: "Something Went Wrong" });
        const userBlogs = await blog.find({ userRef: _id }).populate("userRef", "fullname email _id imageURL");
        if (!userBlogs) req.status(404).json({ message: "You Cannot Posted Any Blog" });
        res.status(200).json({ userBlogs });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred",
            error: error.message,
        });
    }
};


export { addBlog, allBlog, deleteBlog, editBlog, singleBlog, userAllBlog };

