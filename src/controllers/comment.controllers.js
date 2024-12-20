import comment from '../models/comment.models.js'


const userComment = async(req, res) => {
    const { userId, blogId, content } = req.body;
    if (!userId || !blogId || !content) return res.status(400).json({ message: "all feilds are required" })
    try {
        const comments = await comment.create({ userId, blogId, content })
        res.status(201).json({
            message: "comment added successfully",
            comments
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export { userComment }