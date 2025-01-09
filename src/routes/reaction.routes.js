import express from "express";
import { userLike } from "../controllers/like.controllers.js";
import { userComment } from "../controllers/comment.controllers.js";
import { authenticate } from "../middleware/userRef.middleware.js";

const router = express.Router()

router.post('/like', authenticate, userLike)
// router.post('/unlike', userUnLike)
router.post('/comment', userComment)

export default router