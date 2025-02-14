import express from "express";
import { getLikeStatus, userLike } from "../controllers/like.controllers.js";
import { userComment } from "../controllers/comment.controllers.js";
import { authenticate } from "../middleware/userRef.middleware.js";

const router = express.Router()

router.post('/like', authenticate, userLike);
router.get("/blog/:blogId/isLiked", authenticate, getLikeStatus);
router.post('/comment', authenticate, userComment)

export default router