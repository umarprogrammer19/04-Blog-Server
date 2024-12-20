import jwt from 'jsonwebtoken'

const checkUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Login First" })
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" })
        }
        req.user = user
        next()
    })
}

export default checkUser
