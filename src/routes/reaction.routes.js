import express from "express";
import { userLike } from "../controllers/like.controllers.js";
import { userComment } from "../controllers/comment.controllers.js";

const router = express.Router()

router.post('/like', userLike)
router.post('/comment', userComment)

export default router