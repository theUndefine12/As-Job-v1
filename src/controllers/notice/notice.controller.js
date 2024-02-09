import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'




export const getNotices = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const notice = await prisma.notice.findFirst({
            where: { employeesId: userId },
            select: { count: true, notices: true }
        })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found Please check your token' })
        }

        res.status(200).json({ notice })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const clearNotice = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const notice = await prisma.notice.findUnique({
            where: { employeesId: userId }
        })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found Please check your token' })
        }

        const isOwner = notice.employeesId.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        await prisma.notice.update({
            where: { employeesId: userId },
            data: {
                count: 0,
                notices: []
            }
        })

        res.status(200).json({ message: 'Notices is cleared', notice })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


