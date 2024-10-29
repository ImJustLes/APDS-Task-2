import jwt from "jsonwebtoken"

const checkAuth = (req, res, next) => {

    try {

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(generatedToken, "ThisIsASecretRight")
        next()
    }
    catch (err)
    {
        res.status(401).json({ message: "Token inavlid" })
    }
}

export default checkAuth