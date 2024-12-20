import express from 'express'
import { addBlog } from '../controllers/blog.controllers.js'

const router = express.Router()

router.post('/addblog', addBlog)


export default router