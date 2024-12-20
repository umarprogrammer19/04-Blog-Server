import users from "../models/user.models.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

// generative token fro user 
const generateTokenFromUser = (user) => {
        return jwt.sign({ email: user.email }, process.env.JWT_SECERT, {
            expiresIn: '1d'
        });
    }
    // signUp Api
const signUp = async(req, res) => {
    const { fullname, email, password } = req.body;
    if (!email) return res.status(400).json({ messaage: "email is required" });
    if (!password) return res.status(400).json({ messaage: "password is required" });
    try {
        const user = await users.findOne({ email })
        if (user) return res.status(400).json({ message: "user already exits" })
        await users.create({ fullname, email, password })
        res.status(200).json({ messaage: "user register successfully" })
    } catch (error) {
        res.status(400).json({ messaage: "error occured" })
        console.log(error);
    }
}

// login Api 
const signIn = async(req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!password) return res.status(400).json({ message: "password is required" });
    try {
        const user = await users.findOne({ email })
        if (!user) return res.status(400).json({ message: "no user found in this email" })
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ message: "Incorrect Password" })
        const token = generateTokenFromUser(user)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })
        res.status(200).json({ message: "login successfully" })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
    }

}

// logout 
const logOut = async(req, res) => {
    await res.clearCookie("token")
    res.status(200).json({ message: "Logout succesfully" })
}


export { signUp, signIn, logOut }