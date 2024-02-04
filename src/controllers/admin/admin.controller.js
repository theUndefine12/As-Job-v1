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
    const { name, password } = req.body

    try {
        const isHave = await prisma.admin.findUnique({
            where: { name }
        })
        if (isHave) {
            res.status(400).json({ message: 'User is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const admin = new prisma.admin.create({
            data: { name, password: hash }
        })

        const token = generateToken(admin.id)
        res.status(200).json({ message: 'Admin is Signed', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const signIn = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, password } = req.body

    try {
        const admin = await prisma.admin.findUnique({
            where: { name }
        })
        if (!admin) {
            res.status(404).json({ message: 'Admin is not Found' })
        }

        const isPassword = bcrypt.compareSync(password, admin.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not correct' })
        }

        const token = generateToken(admin.id)
        res.status(200).json({ message: 'Signed Succesfully', token })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const admin = await prisma.admin.findUnique({
            where: { id: userId },
            select: { name }
        })
        if (!admin) {
            res.status(404).json({ message: 'Admin is not Found' })
        }

        res.status(200).json({ admin })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})
