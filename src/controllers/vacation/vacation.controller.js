import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const createVacation = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const { name, proffesion, salary, description, direction, contacts, company, conditions, requirements, adresse } = req.body

    try {
        const isHave = await prisma.vacation.findFirst({
            where: { name: name }
        })
        if (isHave) {
            res.status(400).json({ message: 'vacation is created already' })
        }

        const isDirection = await prisma.direction.findFirst({
            where: { name: direction }
        })
        if (!isDirection) {
            res.status(404).json({ message: 'Direction is not found' })
        }

        const vacation = await prisma.vacation.create({
            data: { name, proffesion, salary, description, directionId: isDirection.id, employerId: userId, contacts, company, conditions, requirements, adresse }
        })

        await prisma.employer.update({
            where: { id: userId },
            data: {
                vacationsCount: {
                    increment: 1
                },
                vacations: {
                    connect: { id: vacation.id }
                }
            }
        })

        await prisma.direction.update({
            where: { id: isDirection.id },
            data: {
                vacationCount: {
                    increment: 1
                },
                vacations: {
                    connect: { id: vacation.id }
                }
            }
        })

        res.status(200).json({ message: 'Vacation is created successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getVacation = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { name: true, salary: true, company: true, description: true, proffesion: true, adresse: true, conditions: true, requirements: true, responcesCount: true }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

export const myVacations = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const vacations = await prisma.vacation.findMany({
            where: { employerId: userId },
            select: { id: true, name: true, salary: true, company: true }
        })
        if (!vacations) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        res.status(200).json({ vacations })
    } catch (error) {
        res.status(500).json({ message: 'Sorry error in Server' })
    }
})


export const likeVacation = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const { id } = parseInt(req.params)

    try {
        const favorite = await prisma.favorites.findUnique({
            where: { owner: userId },
            include: { vacations: true }
        })
        if (!favorite) {
            res.status(404).json({ message: 'Favorite is not found' })
        }

        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { contacts: false }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const isHave = favorite.vacations.some(is => is.id === id)
        if (isHave) {
            res.status(400).json({ message: 'Vacation is Liked' })
        }

        await prisma.favorites.update({
            where: { owner: userId },
            data: {
                count: {
                    increment: 1
                },
                vacations: {
                    connect: { id: vacation.id }
                }
            }
        })

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const unlikeVacation = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const { id } = parseInt(req.params)

    try {
        const favorite = await prisma.favorites.findUnique({
            where: { owner: userId },
            include: { vacations: true }
        })
        if (!favorite) {
            res.status(404).json({ message: 'Favorite is not found' })
        }

        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { contacts: false }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const isHave = favorite.vacations.some(is => is.id === id)
        if (!isHave) {
            res.status(404).json({ message: 'Vacation is not liked' })
        }

        await prisma.favorites.update({
            where: { owner: userId },
            data: {
                count: {
                    decrement: 1
                },
                vacations: {
                    disconnect: { id: vacation.id }
                }
            }
        })

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }

})


export const responce = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const employees = await prisma.employees.findUnique({
            where: { id: userId },
            include: { responces: true }
        })
        if (!employees) {
            res.status(404).json({ message: 'Employees is not found' })
        }

        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { responces: true }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const isHave = vacation.responces.some(empl => empl.id === userId)
        if (isHave) {
            res.status(400).json({ message: 'Employees is responced to vacation already' })
            return
        }

        await prisma.vacation.update({
            where: { id: id },
            data: {
                responcesCount: {
                    increment: 1
                },
                responces: {
                    connect: { id: userId }
                }
            }
        })

        await prisma.employees.update({
            where: { id: userId },
            data: {
                responcesCount: {
                    increment: 1
                },
                responces: {
                    connect: { id: id }
                }
            }
        })

        res.status(200).json({ message: 'Your responce is added to vacation Successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const unResponce = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            include: { responces: true }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const employees = await prisma.employees.findUnique({
            where: { id: userId },
            include: { responces: true }
        })
        if (!employees) {
            res.status(404).json({ message: 'Employees is not found' })
        }

        const isResponced = vacation.responces.some(empl => empl.id === userId)
        if (!isResponced) {
            res.status(400).json({ message: 'Employees is not responced' })
            return
        }

        await prisma.employees.update({
            where: { id: userId },
            data: {
                responcesCount: {
                    decrement: 1
                },
                responces: {
                    disconnect: { id: id }
                }
            }
        })

        await prisma.vacation.update({
            where: { id: id },
            data: {
                responcesCount: {
                    decrement: 1
                },
                responces: {
                    disconnect: { id: userId }
                }
            }
        })

        const unResponced = await prisma.vacation.findUnique({
            where: { id: id },
            select: { name: true, salary: true, company: true, description: true, proffesion: true, adresse: true, conditions: true, requirements: true, responcesCount: true }
        })

        res.status(200).json({ unResponced })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const showContacts = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { contacts: true }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const putReview = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)
    const { text } = req.body

    try {
        const employees = await prisma.employees.findUnique({
            where: { id: userId }
        })
        if (!employees) {
            res.status(404).json({ message: 'Employees is not found' })
        }

        const vacation = await prisma.vacation.findUnique({
            where: { id: id }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const review = await prisma.review.create({
            data: {
                text: text,
                employeesId: userId,
                vacationId: id
            }
        })

        await prisma.vacation.update({
            where: { id: id },
            data: {
                reviewsCount: {
                    increment: 1
                },
                reviews: {
                    connect: { id: review.id }
                }
            }
        })

        res.status(200).json({ message: 'Review is added', vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getReviews = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: {
                reviewsCount: true, reviews: {
                    select: { id: true, text: true, createdAt: true, employeesId: true }
                }
            }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteReview = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: { reviewsCount: true, reviews: true }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const review = await prisma.review.findUnique({
            where: { employeesId: userId }
        })
        if (!review) {
            res.status(400).json({ message: 'Review is not found' })
        }

        const employees = await prisma.employees.findUnique({
            where: { id: userId }
        })
        if (!employees) {
            res.status(404).json({ message: 'Employees is not found' })
        }

        const isOwner = review.employeesId.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You are have nor right for this' })
        }

        await prisma.vacation.update({
            where: { id: id },
            data: {
                reviewsCount: {
                    decrement: 1
                },
                reviews: {
                    disconnect: { id: review.id }
                }
            }
        })

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateVacation = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)
    const data = req.body

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const employer = await prisma.employer.findUnique({
            where: { id: userId }
        })
        if (!employer) {
            res.status(404).json({ message: 'Please check your token' })
        }

        const isOwner = vacation.employerId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        const updated = await prisma.vacation.update({
            where: { id: id },
            data: data
        })

        res.status(200).json({ message: 'Vacation is updated', updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteVacation = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const employer = await prisma.employer.findUnique({
            where: { id: userId }
        })
        if (!employer) {
            res.status(404).json({ message: 'Please check your token' })
        }

        const isOwner = vacation.employerId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        await prisma.vacation.delete({
            where: { id: vacation.id }
        })

        res.status(200).json({ message: 'Vacation is deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getResponces = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            select: {
                responcesCount: true, responces: {
                    select: { id: true, name: true, country: true, phone: true, gender: true }
                }
            }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        res.status(200).json({ vacation })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const refuseEmployees = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    const employeeId = parseInt(req.params.id)
    const userId = parseInt(req.userId)

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            include: {
                responces: {
                    select: { id: true, name: true }
                }
            },
            // select: { contacts: false }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId },
            select: { responces: true }
        })
        if (!employee) {
            res.status(404).json({ message: 'Employee is not found' })
        }

        const notice = await prisma.notice.findFirst({
            where: { employeesId: employeeId }
        })
        if (!notice) {
            res.status(404).json({ message: 'Error in Notice Please check your employeeId token' })
        }

        const isHave = vacation.responces.some(employee => employee.id === employeeId)
        if (!isHave) {
            res.status(404).json({ message: 'Employee is not responced' })
        }

        const isOwner = vacation.employerId.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not right for this' })
        }

        await prisma.vacation.update({
            where: { id: id },
            data: {
                responcesCount: {
                    decrement: 1
                },
                responces: {
                    disconnect: { id: employeeId }
                }
            }
        })

        await prisma.employees.update({
            where: { id: employeeId },
            data: {
                responcesCount: {
                    decrement: 1
                },
                responces: {
                    disconnect: { id: id }
                }
            }
        })

        const newM = vacation.id + vacation.name + vacation.company + 'Employer refuse your responce'
        const notices = notice.notices || []
        const newNotice = [...notices, newM]

        await prisma.notice.update({
            where: { employeesId: employeeId },
            data: {
                count: {
                    increment: 1
                },
                notices: newNotice
            }
        })

        res.status(200).json({ message: 'Refused' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const sendMessageToEmloyee = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params)
    const employeeId = parseInt(req.params)
    const { text } = req.body

    try {
        const vacation = await prisma.vacation.findUnique({
            where: { id: id },
            include: {
                responces: {
                    select: { id: true, name: true, country: true, phone: true, gender: true }
                }
            }
        })
        if (!vacation) {
            res.status(404).json({ message: 'Vacation is not found' })
        }

        const employee = await prisma.employees.findUnique({
            where: { id: employeeId }
        })
        if (!employee) {
            res.status(404).json({ message: 'Employee is not found' })
        }

        const notice = await prisma.notice.findUnique({
            where: { employeesId: employeeId }
        })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found' })
        }

        const employer = await prisma.employer.findUnique({
            where: { id: userId }
        })
        if (!employer) {
            res.status(404).json({ message: 'Please check your token' })
        }

        const isOwner = vacation.employerId.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not right for this' })
        }

        const chat = await prisma.chat.create({
            data: { employerId: userId, employeesId: employeeId }
        })

        const messages = chat.messages || []
        const newM = await prisma.message.create({
            data: {
                text: text,
                employerId: userId,
                chatId: chat.id
            }
        })

        await prisma.chat.update({
            where: { id: chat.id },
            data: {
                messages: {
                    connect: { id: newM.id }
                }
            }
        })

        const notices = notice.notices || []
        const newN = employer.id + employer.name + 'Send a message to you'
        const newNotice = [...notices, newN]

        await prisma.notice.update({
            where: { employeesId: employeeId },
            data: {
                count: {
                    increment: 1
                },
                notices: newNotice
            }
        })

        res.status(200).json({ messages: 'Message is sended' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

