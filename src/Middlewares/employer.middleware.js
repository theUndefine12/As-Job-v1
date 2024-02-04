import prisma from "../db/prisma.js"



export const checkEmployer = async (req, res, next) => {
    const userId = req.userId

    try {
        const tokenId = parseInt(userId)
        const employer = await prisma.employer.findUnique({
            where: { id: tokenId }
        })
        if (!employer) {
            res.status(400).json({ message: 'You are have not rules' })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Please check your token' })
    }
}

