import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true 
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        required: true
    },
})
export default mongoose.model('like', likeSchema)