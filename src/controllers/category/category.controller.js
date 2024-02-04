import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const create = asyncHandler(async (req, res) => {
    const { name } = req.body

    try {
        const isHave = await prisma.category.findUnique({
            where: { name }
        })
        if (isHave) {
            res.status(404).json({ message: 'Category is already created' })
        }

        const category = await prisma.category.create({
            data: { name: name }
        })

        res.status(200).json({ message: 'Category is Created', category })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getAll = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany()
    res.status(200).json({ categories })
})


export const getOne = asyncHandler(async (req, res) => {
    const id = parseInt(req.params)

    try {
        const category = await prisma.category.findUnique({
            where: { id: id }
        })
        if (!category) {
            res.status(404).json({ message: 'Category is not found' })
        }

        res.status(200).json({ category })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleted = asyncHandler(async (req, res) => {
    const id = parseInt(req.params)

    try {
        const category = await prisma.category.findUnique({
            where: { id: id }
        })
        if (!category) {
            res.status(404).json({ message: 'Category is not found' })
        }

        await prisma.category.delete({
            where: { id: id }
        })

        res.status(200).json({ message: '' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})
