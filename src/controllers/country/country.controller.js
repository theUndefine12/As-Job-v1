import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const create = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name } = req.body

    try {
        const isHave = await prisma.country.findUnique({
            where: { name }
        })
        if (isHave) {
            res.status(400).json({ message: 'Country is created already ' })
        }

        const country = await prisma.country.create({
            data: { name }
        })

        res.status(200).json({ message: 'Country is Saved', country })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Sevrer ' })
    }
})


export const getAll = asyncHandler(async (req, res) => {
    const countries = await prisma.country.findMany()
    res.status(200).json({ countries })
})


export const getOne = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const countryId = parseInt(id)
        const country = await prisma.country.findUnique({
            where: { id: countryId },
            include: { categories }
        })
        if (!country) {
            res.status(404).json({ message: 'Country is not found' })
        }

        res.status(200).json({ country })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Sevrer ' })
    }
})


export const deleteCountry = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const countryId = parseInt(id)
        const country = await prisma.country.delete({
            where: { id: countryId }
        })

        res.status(200).json({ message: 'Country is deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Sevrer ' })
    }
})

