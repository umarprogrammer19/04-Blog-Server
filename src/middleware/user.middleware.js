import jwt from "jsonwebtoken";

export const authenticateUser = (req, res) => {
    const refresJwtToken = req.cookie.refreshToken;
    if (!refresJwtToken) return res.status(404).json({ message: "Please Login First To Access This Page" });

    jwt.verify(refresJwtToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Cannot Verify JWT" });
        req.user = user;
        res.json({
            message: "User Verified",
            user: req.user,
            token,
        });
    });
};