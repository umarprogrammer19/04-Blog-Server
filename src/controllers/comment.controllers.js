import comment from '../models/comment.models.js';

const userComment = async(req, res) => {
    const { userId, blogId, content } = req.body;
    if (!userId || !blogId || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create the comment
        const comments = await comment.create({ userId, blogId, content });

        // Populate userId and blogId references
        const populatedComment = await comment
            .findById(comments._id) // Use 'comments._id' instead of 'comment._id'
            .populate('userId', 'email') // Populate email from User model
            .populate('blogId', 'title content'); // Populate title and content from Blog model

        res.status(201).json({
            message: "Comment added successfully",
            comments,
            populatedComment
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { userComment };