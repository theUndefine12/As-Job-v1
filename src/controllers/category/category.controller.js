import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const create = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, country } = req.body

    try {
        const isHave = await prisma.category.findFirst({
            where: { name: name }
        })
        if (isHave) {
            res.status(404).json({ message: 'Category is already created' })
        }

        let isCountry = await prisma.country.findFirst({
            where: { name: country }
        })
        if (!isCountry) {
            res.status(404).json({ message: 'Country is not found' })
        }

        const category = await prisma.category.create({
            data: { name: name, countryId: isCountry.id }
        })

        res.status(200).json({ message: 'Category is Created', category })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getAll = asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, count: true }
    })
    res.status(200).json({ categories })
})


export const getOne = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const category = await prisma.category.findUnique({
            where: { id: id },
            select: { id: true, name: true, count: true, directions: true }
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
