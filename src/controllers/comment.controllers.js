import comment from '../models/comment.models.js';

const userComment = async (req, res) => {
    const { userId, blogId, content } = req.body;
    if (!userId || !blogId || !content) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const comments = await comment.create({ userId, blogId, content });

        const populatedComment = await comment
            .findById(comments._id)
            .populate('userId', 'email')
            .populate('blogId', 'title content');

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