import express from 'express';
import { addBlog, allBlog, deleteBlog, editBlog, singleBlog, userAllBlog } from '../controllers/blog.controllers.js';
import { upload } from '../middleware/multer.middleware.js';
import { authenticate } from '../middleware/userRef.middleware.js';

const app = express();
const router = express.Router()

router.post('/addblog', authenticate, upload.single("image"), addBlog);
router.delete('/delete/:id', authenticate, deleteBlog);
router.put('/edit/:id', authenticate, upload.single("image"), editBlog);
router.get('/blogs', allBlog);
router.get('/userBlog', authenticate, userAllBlog);
router.get('/blog/:id', singleBlog);


export default router