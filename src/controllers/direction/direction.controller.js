import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const createDirection = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { id } = req.params
    const { name } = req.body

    try {
        const isHave = await prisma.direction.findFirst({
            where: { name: name }
        })
        if (isHave) {
            res.status(400).json({ message: 'Direction is already created' })
        }

        let category = await prisma.category.findUnique({
            where: { id: id }
        })
        if (!category) {
            category = await prisma.category.create({
                data: { name: name }
            })
        }

        const direction = await prisma.direction.create({
            data: { name: name, categoryId: category.id }
        })

        await prisma.category.update({
            where: { id: category.id },
            data: {
                count: {
                    increment: 1
                },
                directions: {
                    connect: { id: direction.id }
                }
            }
        })

        res.status(200).json({ message: 'Direction is Created Successfully', direction })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getDirection = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const direction = await prisma.direction.findUnique({
            where: { id: id },
            include: { vacations: true }
        })
        if (!direction) {
            res.status(404).json({ message: 'Direction is not Found' })
        }

        res.status(200).json({ direction })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})



