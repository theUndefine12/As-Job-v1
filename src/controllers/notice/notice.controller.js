import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'




export const getNotices = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const notice = await prisma.notice.findFirst({
            where: { employeesId: userId },
            select: {
                count: true, notices: {
                    select: { id: true, company: true, employerId: true, vacationId: true, text: true, createdAt: true }
                }
            }
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
        const notice = await prisma.notice.findFirst({
            where: { employeesId: userId },
            include: { notices: true }
        })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found Please check your token' })
        }

        const isOwner = notice.employeesId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        const msgs = notice.notices.map(msg => msg.id)

        await prisma.notices.deleteMany({
            where: { id: { in: msgs } }
        })

        await prisma.notice.update({
            where: { id: notice.id },
            data: {
                count: 0,
                notices: {
                    set: []
                }
            }
        })

        res.status(200).json({ message: 'Notices is cleared' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


