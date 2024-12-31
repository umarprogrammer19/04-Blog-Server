import like from '../models/like.models.js'
const userLike = async (req, res) => {
    const { userId, blogId, } = req.body;
    try {
        const existingLike = await like.findOne({ userId, blogId });
        if (existingLike) {
            await like.deleteOne({ userId, blogId });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            const newLike = new like({
                userId,
                blogId
            });
            await newLike.save();
            return res.status(201).json({ message: "Post liked successfully", like: newLike });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export { userLike };