import express from 'express';
import { addBlog, allBlog, deleteBlog, editBlog, singleBlog } from '../controllers/blog.controllers.js';
import { upload } from '../middleware/multer.middleware.js';
import { authenticate } from '../middleware/userRef.middleware.js';

const app = express();
const router = express.Router()

router.post('/addblog', authenticate, upload.single("image"), addBlog)
router.delete('/delete/:id', deleteBlog)
router.put('/edit/:id', editBlog)
router.get('/blogs', allBlog)
router.get('/blog/:id', singleBlog)


export default router