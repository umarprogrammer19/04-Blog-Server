import mongoose from 'mongoose';
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
            .populate('userId', '_id email fullname imageURL')
            .populate('blogId', 'title');

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteComment = async (req, res) => {
    if (!req.user) return res.status(400).json({ message: "Please Login First" });

    const { commentId } = req.body;
    if (!commentId) return res.status(400).json({ message: "Comment ID is required" });
    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).json({ message: "Invalid Comment ID" });

    try {
        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment Not Found" });

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own comment" });
        }

        await Comment.findByIdAndDelete(commentId);

        await Blog.findByIdAndUpdate(comment.blogId, {
            $pull: { comments: commentId }
        });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const replyToComment = async (req, res) => {
    const { content, parentCommentId } = req.body;

    if (!req.user) return res.status(401).json({ message: "Please login" });
    if (!parentCommentId || !content) {
        return res.status(400).json({ message: "Reply must have content and a parent comment ID" });
    }

    try {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            return res.status(404).json({ message: "Parent comment not found" });
        }

        const reply = await Comment.create({
            userId: req.user._id,
            blogId: parentComment.blogId,
            content,
            parent: parentCommentId,
        });

        // Optional: Push reply ID to parent comment
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(reply._id);
        await parentComment.save();

        const populatedReply = await Comment.findById(reply._id)
            .populate("userId", "fullname email imageURL");

        return res.status(201).json({ message: "Reply added successfully", reply: populatedReply });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export { userComment, deleteComment, replyToComment };
