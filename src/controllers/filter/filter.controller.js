import asyncHandler from 'express-async-handler'
import prisma from '../../db/prisma.js'



export const filterEntities = asyncHandler(async (req, res) => {
    try {
        const { countryId, categoryId, directionId } = req.query

        const countryFilter = {
            id: countryId ? parseInt(countryId) : undefined
        }

        const categoryFilter = {
            id: categoryId ? parseInt(categoryId) : undefined
        }

        const directionFilter = {
            id: directionId ? parseInt(directionId) : undefined
        }

        let resultData
        if (directionId) {
            resultData = await prisma.country.findMany({
                where: countryFilter,
                include: {
                    categories: {
                        where: categoryFilter,
                        include: {
                            directions: {
                                where: directionFilter,
                                include: {
                                    vacations: {
                                        select: { id: true, name: true, profession: true, company: true, salary: true }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
        else if (categoryId) {
            resultData = await prisma.country.findMany({
                where: countryFilter,
                include: {
                    categories: {
                        where: categoryFilter,
                        include: {
                            directions: {
                                select: { id: true, name: true, vacationCount: true }
                            }
                        }
                    }
                }
            })
        } else if (countryId) {
            resultData = await prisma.country.findMany({
                where: countryFilter,
                include: {
                    categories: {
                        select: { id: true, name: true, count: true }
                    }
                }
            })
        }

        if (countryId && resultData.length === 0) {
            res.status(404).json({ message: 'Country is not found' })
        }

        res.status(200).json({ filter: resultData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export const employeeFilter = asyncHandler(async (req, res) => {

})

