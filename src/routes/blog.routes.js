import express from 'express'
import { addBlog, deleteBlog } from '../controllers/blog.controllers.js'

const router = express.Router()

router.post('/addblog', addBlog)
router.delete('/delete/:id', deleteBlog)


export default router