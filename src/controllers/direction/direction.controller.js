import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const createDirection = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }

    const { name, category } = req.body

    try {
        const isHave = await prisma.direction.findFirst({
            where: { name: name }
        })
        if (isHave) {
            res.status(400).json({ message: 'Direction is already created' })
        }

        const isCategory = await prisma.category.findFirst({
            where: { name: category }
        })
        if (!category) {
            res.status(404).json({ message: 'Category is not found' })
        }

        const direction = await prisma.direction.create({
            data: { name: name, categoryId: isCategory.id }
        })

        await prisma.category.update({
            where: { id: isCategory.id },
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


export const getDirections = asyncHandler(async (req, res) => {
    const directions = await prisma.direction.findMany({
        select: { id: true, name: true, vacationCount: true },
    })

    res.status(200).json({ directions })
})


export const getDirection = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const direction = await prisma.direction.findUnique({
            where: { id: id },
            select: {
                id: true, name: true, vacationCount: true, vacations: {
                    select: { id: true, name: true, salary: true, company: true }
                }
            }
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



