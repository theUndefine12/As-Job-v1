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
    const { name, email, password } = req.body

    try {
        const isHave = await prisma.employer.findUnique({
            where: { email: email }
        })
        if (isHave) {
            res.status(400).json({ message: 'Employer is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const employer = await prisma.employer.create({
            data: { name, email, password: hash }
        })

        const token = generateToken(employer.id)
        res.status(200).json({ message: 'Employer is Signed', token })
    } catch (error) {
        console.log(error)
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
        const employer = await prisma.employer.findUnique({
            where: { email }
        })
        if (!employer) {
            res.status(404).json({ message: 'Employer is not Found' })
        }

        const isPassword = bcrypt.compareSync(password, employer.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(employer.id)
        res.status(200).json({ message: 'Employer Succesfully', token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const employer = await prisma.employer.findUnique({
            where: { id: userId },
            select: { name: true, email: true, vacationsCount: true }
        })
        if (!employer) {
            res.status(404).json({ message: 'Employer is not Found' })
        }

        res.status(200).json({ employer })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})

