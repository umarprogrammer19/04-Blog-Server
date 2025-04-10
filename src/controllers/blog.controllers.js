import Blog from '../models/blog.models.js';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

//  Add a new blog post.
export const addBlog = async (req, res) => {
    let { title, description, quotes, conclusion, subsections } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!req.file) return res.status(400).json({ message: "Please upload an image" });
    if (!req.user) return res.status(401).json({ message: "User unauthorized" });

    try {
        if (subsections && typeof subsections === "string") {
            subsections = JSON.parse(subsections);
        }
    } catch (err) {
        return res.status(400).json({ message: "Invalid format for subsections. Must be a valid JSON array." });
    }

    if (subsections && Array.isArray(subsections) && subsections.length > 5) {
        return res.status(400).json({ message: "A maximum of 5 subsections is allowed" });
    }

    try {
        const imageURL = await uploadImageToCloudinary(req.file.path);
        if (!imageURL) return res.status(500).json({ message: "Error uploading the image" });

        const blogPost = await Blog.create({
            title,
            description,
            quotes: quotes || "",
            conclusion: conclusion || "",
            subsections: subsections || [],
            imageURL,
            userRef: req.user._id,
        });

        return res.status(201).json({
            message: "Blog added successfully",
            blog: blogPost,
        });
    } catch (error) {
        console.error("Error adding blog:", error);
        return res.status(500).json({ message: "An error occurred while adding the blog", error: error.message });
    }
};


//  Edit an existing blog post.
export const editBlog = async (req, res) => {
    const { id } = req.params;
    let { title, description, quotes, conclusion, subsections } = req.body;

    if (!id) return res.status(400).json({ message: "Blog ID is required" });
    if (!title && !description && !req.file && typeof quotes === 'undefined' &&
        typeof conclusion === 'undefined' && !subsections) {
        return res.status(400).json({ message: "Provide at least one field to update (title, description, image, quotes, conclusion, or subsections)" });
    }
    if (!req.user) return res.status(401).json({ message: "User unauthorized" });

    try {
        if (subsections && typeof subsections === "string") {
            subsections = JSON.parse(subsections);
        }
    } catch (err) {
        return res.status(400).json({ message: "Invalid format for subsections. Must be a valid JSON array." });
    }

    if (subsections && Array.isArray(subsections) && subsections.length > 5) {
        return res.status(400).json({ message: "A maximum of 5 subsections is allowed" });
    }

    try {
        let imageURL;
        if (req.file) {
            imageURL = await uploadImageToCloudinary(req.file.path);
            if (!imageURL) return res.status(500).json({ message: "Error uploading the image. Please try again." });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (typeof quotes !== "undefined") updateData.quotes = quotes;
        if (typeof conclusion !== "undefined") updateData.conclusion = conclusion;
        if (subsections) updateData.subsections = subsections;
        if (imageURL) updateData.imageURL = imageURL;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "No blog found with this ID" });

        return res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ message: "An error occurred while updating the blog", error: error.message });
    }
};



// Delete blog Post
export const deleteBlog = async (req, res) => {
    const { id: blogId } = req.params;

    if (!blogId) return res.status(400).json({ message: "Blog ID is required" });
    if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).json({ message: "Invalid Blog ID" });
    if (!req.user) return res.status(401).json({ message: "You need to log in first" });

    try {
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) return res.status(404).json({ message: "No blog found with this ID" });

        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "An error occurred while deleting the blog" });
    }
};

// Get All Blogs 
export const allBlog = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate("userRef", "_id fullname email imageURL")
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "_id fullname email imageURL"
                }
            });

        const blogsWithLikesCount = blogs.map(blog => ({
            ...blog.toObject(),
            likesCount: blog.like.length,
        }));

        return res.status(200).json({
            message: "Fetched all blogs successfully",
            blogs: blogsWithLikesCount,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ message: "Error occurred while fetching blogs", error: error.message });
    }
};

// Single Blog By Id 
export const singleBlog = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Blog ID is required" });

    try {
        const blogPost = await Blog.findById(id)
            .populate({
                path: "comments",
                populate: {
                    path: "userId",
                    select: "_id fullname email"
                }
            });

        if (!blogPost) return res.status(404).json({ message: "No blog found with this ID" });

        return res.status(200).json({
            message: "Blog fetched successfully",
            blog: blogPost,
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ message: "Error occurred while fetching the blog", error: error.message });
    }
};

// Get all blog posts for the authenticated user.
export const userAllBlog = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "User unauthorized" });

    try {
        const userBlogs = await Blog.find({ userRef: req.user._id }).populate("userRef", "fullname email _id imageURL");

        if (!userBlogs || userBlogs.length === 0) {
            return res.status(404).json({ message: "No blogs found for this user" });
        }

        return res.status(200).json({ userBlogs });
    } catch (error) {
        console.error("Error fetching user's blogs:", error);
        return res.status(500).json({ message: "Error occurred while fetching your blogs", error: error.message });
    }
};