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
    const { name, country, gender, phone, password } = req.body

    try {
        const isHave = await prisma.employees.findUnique({
            where: {phone: phone }
        })
        if (isHave) {
            res.status(400).json({ message: 'Employees is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const employees = await prisma.employees.create({
            data: { name, country, phone, gender, password: hash }
        })

        await prisma.favorites.create({
            data: { employeesId: employees.id }
        })

        await prisma.notice.create({
            data: { employeesId: employees.id }
        })

        await sendSMS(datas, phone)
        res.status(200).json({ message: 'Go through otp' })
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
        const employee = await prisma.employees.findFirst({
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

        const token = generateToken(employee.id)
        res.status(200).json({message: 'Employee is authorized successfully', token})
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
    const { phone, password } = req.body

    try {
        const employees = await prisma.employees.findUnique({
            where: { phone: phone }
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
    const userId = parseInt(req.userId)

    try {
        const employees = await prisma.employees.findUnique({
            where: { id: userId },
            select: { name: true, country: true, phone: true, responcesCount: true, isResume: true },
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
    const userId = parseInt(req.userId)
    const data = req.body

    try {
        const employees = await prisma.employees.update({
            where: { id: userId },
            data: data
        })

        if (!employees) {
            res.status(400).json({ message: 'Please check your request' })
        }

        const updated = await prisma.employees.findUnique({
            where: { id: userId },
            select: { name: true, email: true, country: true, phone: true, responcesCount: true }
        })

        res.status(200).json({ message: 'Profile is updated', updated })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const myResponces = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const employee = await prisma.employees.findUnique({
            where: { id: userId },
            select: {
                responcesCount: true, responces: {
                    select: { id: true, name: true, salary: true, proffesion: true, company: true }
                }
            }
        })
        if (!employee) {
            res.status(404).json({ message: 'Please check your token' })
        }

        res.status(200).json({ employee })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const getEmployees = asyncHandler(async(req, res) => {
    const employees = await prisma.employees.findMany({
        select: {id: true, name: true, profession: true, country: true}
    })

    res.status(200).json({employees})
})


export const getEmployee = asyncHandler(async(req, res) => {
    const id = parseInt(req.params.id)

    try {
        const employee = await prisma.employees.findUnique({
            where: {id: id},
            select: {id: true, name: true, phone: true, profession: true, country: true, gender: true, isResume: true}
        })
        if(!employee) {
            res.status(404).json({message: 'User is not found'})
        }

        res.status(200).json({employee})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Sorry Error in Server'})
    }
})
