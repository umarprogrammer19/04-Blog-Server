import Blog from '../models/blog.models.js';
import Comment from '../models/comment.models.js';

const userComment = async (req, res) => {
    const { blogId, content } = req.body;
    if (!req.user) return res.status(400).json({ message: "Please Login First" });

    const userId = req.user._id;
    if (!userId || !blogId || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create the comment
        const newComment = await Comment.create({ userId, blogId, content });

        // Push the comment ID to the blog's comments array
        await Blog.findByIdAndUpdate(blogId, {
            $push: { comments: newComment._id }
        });

        // Populate the response
        const populatedComment = await Comment
            .findById(newComment._id)
            .populate('userId', 'email fullname')
            .populate('blogId', 'title');

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { userComment };
