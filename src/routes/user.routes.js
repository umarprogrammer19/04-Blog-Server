import express from "express"
import { logOut, signIn, signUp } from "../controllers/user.controllers.js"

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/logout', logOut)


export default router