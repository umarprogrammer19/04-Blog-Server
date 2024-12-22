import express from "express";
import { logOut, signIn, signUp } from "../controllers/user.controllers.js";
import { authenticateUser } from "../middleware/user.middleware.js";

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/logout', logOut)
router.get("/verifyUser", authenticateUser, (req, res) => {
    res.json({ message: "Hey! You Are Logged In", user: req.user });
});


export default router;