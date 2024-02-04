import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'
import { generateToken } from '../../utils/generatorTokens.js'
import bcrypt from 'bcrypt'


export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, email, country, phone, password } = req.body

    try {
        const isHave = await prisma.employees.findUnique({
            where: { email }
        })
        if (isHave) {
            res.status(400).json({ message: 'Employees is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const employees = new prisma.employees.create({
            data: { name, email, country, phone, password: hash }
        })

        await prisma.favorites.create({
            data: { owner: employees.id }
        })

        const token = generateToken(employees.id)
        res.status(200).json({ message: 'Employees is Saved', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const signIn = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { email, password } = req.body

    try {
        const employees = await prisma.employees.findUnique({
            where: { email }
        })
        if (!employees) {
            res.status(404).json({ message: 'Employees is not Found' })
        }

        const isPassword = bcrypt.compareSync(password, employees.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(employees.id)
        res.status(200).json({ message: 'Employees is Signed', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const employees = await prisma.employees.findUnique({
            where: { id: userId },
            select: { name, email, country, phone },
        })
        if (!employees) {
            res.status(404).json({ message: 'Admin is not Found' })
        }

        res.status(200).json({ employees })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const update = asyncHandler(async (req, res) => {
    const userId = req.userId
    const data = req.body

    try {
        const employees = await prisma.employees.update({
            where: { id: userId },
            data: data
        })

        if (!employees) {
            res.status(400).json({ message: 'Please check your request' })
        }

        res.status(200).json({ message: 'Profile is updated', employees })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})

