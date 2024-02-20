import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'
import { generateToken } from '../../utils/generatorTokens.js'
import { sendSMS, datas  } from '../../services/eskiz.service.js'
import bcrypt from 'bcrypt'



export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { name, phone, password } = req.body

    try {
        const isHave = await prisma.employer.findUnique({
            where: { phone: phone }
        })
        if (isHave) {
            res.status(400).json({ message: 'Employer is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const employer = await prisma.employer.create({
            data: { name, phone, password: hash }
        })

        sendSMS(datas, phone)
        res.status(200).json({ message: 'Go throught otp'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const authVerify = asyncHandler(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({message: 'Please check your request', errors})
    }
    const {phone,code} = req.body
    
    try {
        const employer = await prisma.employer.findUnique({
            where: {
                phone: phone
            }
        })

        const eskiz = await prisma.otp.findFirst({
            where: {
                phone: phone
            }
        })
        if(!eskiz) {
            res.status(400).json({message: 'The Eskiz code time is end'})
            return
        }

        const eskizCode = eskiz.code
        const isCode = code === eskizCode
        if(!isCode) {
            res.status(400).json({message: 'Code is not correct'})
            return
        }

        const token = generateToken(employer.id)
        res.status(200).json({message: 'Employer is authorized successfully', token})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
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

