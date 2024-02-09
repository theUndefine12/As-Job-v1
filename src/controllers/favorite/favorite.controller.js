import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const get = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const favorite = await prisma.favorites.findFirst({
            where: { employeesId: userId },
            select: { count: true, vacations: true }
        })
        if (!favorite) {
            res.status(404).json({ message: 'Favorite is not found' })
        }

        res.status(200).json({ favorite })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})
