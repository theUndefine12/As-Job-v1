import prisma from "../db/prisma.js"



export const checkAdmin = async (req, res, next) => {
    const userId = req.userId

    try {
        const tokenId = parseInt(userId)
        const admin = await prisma.admin.findUnique({
            where: { id: tokenId }
        })
        if (!admin) {
            res.status(400).json({ message: 'You are have not rules' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Please check your token' })
    }
}

