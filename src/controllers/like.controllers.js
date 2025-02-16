import blogModels from "../models/blog.models.js";

export const userLike = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user._id;

        if (!userId) return res.status(400).json({ message: "Please Login First" });
        const blog = await blogModels.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const isLiked = blog.like.includes(userId);

        if (isLiked) {
            await blogModels.findByIdAndUpdate(
                blogId,
                { $pull: { like: userId } },
                { new: true }
            );
            return res.status(200).json({
                message: 'Blog unliked successfully',
                isLiked: false,
                userId
            });
        } else {
            await blogModels.findByIdAndUpdate(
                blogId,
                { $push: { like: userId } },
                { new: true }
            );
            return res.status(200).json({
                message: 'Blog liked successfully',
                isLiked: true,
                userId
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};


export const getLikeStatus = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user._id;

        const blog = await blogModels.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const isLiked = blog.like.includes(userId);
        res.status(200).json({ isLiked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred." });
    }
};
