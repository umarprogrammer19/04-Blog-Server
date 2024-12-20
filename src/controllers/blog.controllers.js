import mongoose from "mongoose";


import blog from '../models/blog.models.js'


const addBlog = async(req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" })
    if (!description) return res.status(400).json({ message: "description is required" })
    try {
        await blog.create({ title, description })
        res.status(201).json({ message: "blog added successfully" })
    } catch (error) {
        res.status(500).json({ message: "error occurred" })
    }
}

const deleteBlog = async(req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id is required" })
    try {
        const blogFound = await blog.findByIdAndDelete(id)
        if (!blogFound) return res.status(404).json({ message: "no blog found !" })
        res.status(200).json({ message: "blog deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "error occurred" })
    }
}



export { addBlog, deleteBlog }