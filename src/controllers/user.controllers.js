import users from "../models/user.models.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

// generative token fro user 
const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: "6h",
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};

// signUp Api
const signUp = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) return res.status(400).json({ messaage: "full Name is required" });
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
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "Email is Required" });
        if (!password) return res.status(400).json({ message: "Password is Required" });

        const user = await users.findOne({ email });
        if (!user) return res.status(404).json({ message: "User Does Not Exists With This Email" });

        const isTruePassword = await bcrypt.compare(password, user.password);
        if (!isTruePassword) return res.status(400).json({ message: "Password Is Incorrect" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });

        res.status(200).json({
            message: "User Logged In Successfully",
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during Login" });
    }
}

// logout 
const logOut = async (req, res) => {
    try {
        await res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout Successfull" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An error occurred during Logout" })
    };
};


export { signUp, signIn, logOut }