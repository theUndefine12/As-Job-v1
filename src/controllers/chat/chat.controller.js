import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import prisma from '../../db/prisma.js'



export const getChats = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)

    try {
        const isEmployee = await prisma.employees.findUnique({
            where: {id: userId}
        })

        const isEmployer = await prisma.employer.findUnique({
            where: {id: userId}
        })

        if(isEmployee) {
            const chats = await prisma.chat.findMany({
                select: {id: true, employer: {
                    select: {id: true, name: true},
                }, createdAt: true},
            })

            res.status(200).json({message: 'You are a Employee ---', chats})
            return
        }

        if(isEmployer) {
            const chats = await prisma.chat.findMany({
                where: {employerId: userId},
                select: {id: true, employee: {
                    select: {id: true, name: true}
                }, createdAt: true}
            })

            res.status(200).json({chats})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getChat = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const isEmployee = await prisma.employees.findUnique({
            where: { id: userId }
        })

        const isEmployer = await prisma.employer.findUnique({
            where: { id: userId }
        })

        const chat = await prisma.chat.findUnique({
            where: {id: id},
            include: {messages: true}
        })

        let owner
        if (isEmployee) {
            owner = isEmployee.id
        } else if (isEmployer) {
            owner = isEmployer.id
        } else {
            res.status(400).json({ message: 'Please check your userId' })
            return
        }

        const messages = chat.messages.filter((msg) => msg.ownerId !== owner)
        await prisma.message.updateMany({
            where: {
                id: {
                    in: messages.map((msg) => msg.id)
                }
            },
            data: {
                viewed: true
            }
        })

        if(isEmployee) {
            const chat = await prisma.chat.findUnique({
                where: {id: id},
                select: {employer: {
                    select: {id: true, name: true}
                },
                messagesCount: true,
                messages: {
                    select: {id: true, owner: true, text: true, viewed: true, createdAt: true}
                }
            }
            })
            
            res.status(200).json({messages: 'Employee ---', chat})
            return
        }

        if(isEmployer) {
            const chat = await prisma.chat.findUnique({
                where: {id: id},
                select: {employee: {
                    select: {id: true, name: true}
                },
                messagesCount: true,
                messages: {
                    select: {id: true, owner: true, text: true, viewed :true, createdAt: true}
                }
            }
            })

            res.status(200).json({messages: 'Employer +++',chat})
            return
        }


        res.status(400).json({messages: 'Error xxxxx'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const sendMessage = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)
    const { text } = req.body

    try {
        const isEmployee = await prisma.employees.findUnique({
            where: { id: userId }
        })

        const isEmployer = await prisma.employer.findUnique({
            where: { id: userId }
        })

        const chat = await prisma.chat.findUnique({
            where: { id: id },
            include: { messages: true }
        })
        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
            return
        }

        let newMsg
        if (isEmployee) {
            newMsg = {
                text: text,
                chatId: id,
                owner: 'Employees',
                ownerId: userId
            }
        } else if (isEmployer) {
            newMsg = {
                text: text,
                chatId: id,
                owner: 'Employer',
                ownerId: userId
            }
        } else {
            res.status(400).json({ message: 'Error when send a message' })
        }

        await prisma.message.create({
            data: newMsg
        })

        await prisma.chat.update({
            where: {id: id},
            data: {
                messagesCount: {
                    increment: 1
                }
            }
        })

        const updated = await prisma.chat.findUnique({
            where: { id: id },
            include: {
                messages: {
                    select: { id: true, ownerId: true, owner: true, text: true, viewed: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        res.status(200).json({ message: 'Messages is sended', updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteMessage = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const chatId = parseInt(req.params.id)
    const msgId = parseInt(req.params.msgId)

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { messages: true }
        })
        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        const msg = await prisma.message.findUnique({
            where: { id: msgId }
        })

        const isMsg = chat.messages.some(msg => msg.id === msgId)
        if (!isMsg) {
            res.status(404).json({ message: 'Message is not found in chat' })
            return
        }

        const isOwner = msg.ownerId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rghts for this' })
            return
        }

        await prisma.message.delete({
            where: { id: msgId }
        })

        const updated = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: {
                    select: { id: true, ownerId: true, owner: true, text: true, viewed: true, createdAt: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        res.status(200).json({ message: 'Message is deleted', updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const clearHistory = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: id },
            include: { messages: true }
        })
        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        const isOwner = chat.employeesId === userId || chat.employerId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
            return
        }

        const msgs = chat.messages.map(msg => msg.id)
        await prisma.message.deleteMany({
            where: { id: { in: msgs } }
        })

        await prisma.chat.update({
            where: {id: id},
            data: {
                messagesCount: 0
            }
        })

        res.status(200).json({ message: 'Chat is Cleaned' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteChat = asyncHandler(async (req, res) => {
    const userId = parseInt(req.userId)
    const id = parseInt(req.params.id)

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: id }
        })
        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        const isOwner = chat.employeesId === userId || chat.employerId === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have not rights for this' })
            return
        }

        await prisma.chat.delete({
            where: { id: id }
        })

        res.status(200).json({ message: 'Chat is deleted Successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Errron in Server' })
    }
})

