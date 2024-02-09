import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const create = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const { name, surname, bio, profession, contacts, country } = req.body

    try {
        const isHave = await prisma.resume.findFirst({
            where: { employeesId: userId }
        })
        if (isHave) {
            res.status(400).json({ message: 'Resume is created' })
        }

        const contactsString = contacts.join(', ')

        const resume = await prisma.resume.create({
            data: { name, surname, bio, profession, contacts: contactsString, country, employeesId: userId }
        })

        res.status(200).json({ message: 'Resume is created', resume })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const get = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const resume = await prisma.resume.findFirst({
            where: { employeesId: userId },
            select: {
                name: true, surname: true, bio: true, profession: true,
                contacts: true, country: true
            }
        })

        if (!resume) {
            res.status(404).json({ message: 'Resume is not found' })
        }

        res.status(200).json({ resume })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const update = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const data = req.body

    try {
        const resume = await prisma.resume.findFirst({
            where: { employeesId: userId }
        })

        if (!resume) {
            res.status(404).json({ message: 'Resume is not found' })
        }

        const updated = await prisma.resume.update({
            where: { id: resume.id },
            data: data
        })

        res.status(200).json({ message: 'Resume is updated', updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleted = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const resume = await prisma.resume.findFirst({
            where: { employeesId: userId }
        })

        if (!resume) {
            res.status(404).json({ message: 'Resume is not found' })
        }

        await prisma.resume.delete({
            where: { id: resume.id }
        })

        res.status(200).json({ message: 'Resume is deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

