import asyncHandler from 'express-async-handler'
import prisma from '../../db/prisma.js'



export const searcVacation = asyncHandler(async (req, res) => {
    try {
        const vacationName = req.query.name

        const vacations = await prisma.vacation.findMany({
            where: {
                name: vacationName
            },
            select: { id: true, name: true, salary: true, profession: true, company: true }
        })

        if (vacations.length === 0) {
            res.status(404).json({ message: 'Vacation is not found' })
            return
        }

        res.status(200).json({ vacations })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const searchEmployees = asyncHandler(async (req, res) => {
    const employee = req.query.name

    try {
        const employees = await prisma.employees.findMany({
            where: {
                name: employee
            },
            select: { id: true, name: true, phone: true, country: true, gender: true }
        })

        if (!employees || employees.length === 0) {
            res.status(404).json({ message: 'Employee is not found' })
            return
        }

        res.status(200).json({ employees })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

