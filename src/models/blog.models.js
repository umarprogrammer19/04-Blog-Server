import mongoose from "mongoose";
import users from "../models/user.models.js";

const subsectionSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        required: true,
        trim: true,
    },
    subdescription: {
        type: String,
        required: true,
        trim: true,
    }
}, { _id: false });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Development", "Design", "Marketing", "Business", "Education", "Lifestyle", "Artificial Intelligence", "Branding"]
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: users,
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    imageURL: {
        type: String,
        required: true,
    },
    quotes: {
        type: String,
        trim: true,
        default: "",
    },
    conclusion: {
        type: String,
        trim: true,
        default: "",
    },
    subsections: {
        type: [subsectionSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
        default: [],
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 5;
}

export default mongoose.model('blog', blogSchema);
