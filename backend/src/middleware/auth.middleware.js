import jwt from "jsonwebtoken"


export function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }



    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
        })
    }

}

export function protect(req, res, next) {

    authUser(req, res, () => {
        if (req.user) {
            next()
        } else {
            return res.status(401).json({
                message: "Unauthorized",
            })
        }
    })

}