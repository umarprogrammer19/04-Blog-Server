import express from 'express'
import { addBlog, allBlog, deleteBlog, editBlog, singleBlog } from '../controllers/blog.controllers.js'

const router = express.Router()

router.post('/addblog', addBlog)
router.delete('/delete/:id', deleteBlog)
router.put('/edit/:id', editBlog)
router.get('/blogs', allBlog)
router.get('/blog/:id', singleBlog)


export default router