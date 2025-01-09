import mongoose from "mongoose";

const userComment = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    content: {
        type: String,
        required: true
    }
})


export default mongoose.model('comment', userComment)