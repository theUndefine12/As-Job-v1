import jwt from 'jsonwebtoken'


export const authSecurity = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodedToken.userId
        next()
    } catch (errors) {
        console.log(errors)
        res.status(400).json({ message: 'Please Put Token' })
    }
}