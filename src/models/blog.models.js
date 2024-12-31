import mongoose from "mongoose";
import users from "../models/user.models.js";

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: users,
    },
    imageURL: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model('blog', blogSchema)