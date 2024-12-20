import express from "express";
import { userLike } from "../controllers/like.controllers.js";



const router = express.Router()

router.post('/like', userLike)

export default router