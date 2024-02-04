import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/Auth.js'
import { create, deleted, get, update } from './resume.controller.js'
import { checkEmployees } from '../../Middlewares/Employees.js'



const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('surname', 'Surname is required').notEmpty(),
        check('bio', 'Bio is required').notEmpty(),
        check('profession', 'Profession is required').notEmpty(),
        check('contacts', 'Coontacts is required').notEmpty(),
        check('country', 'Country is required').notEmpty(),
    ],
    authSecurity, checkEmployees, create
)
router.route('/').put(
    [
        check('name', 'Name is required').optional().notEmpty(),
        check('surname', 'Surname is required').optional().notEmpty(),
        check('bio', 'Bio is required').optional().notEmpty(),
        check('profession', 'Profession is required').optional().notEmpty(),
        check('contacts', 'Coontacts is required').optional().notEmpty(),
        check('country', 'Country is required').optional().notEmpty(),
    ],
    authSecurity, checkEmployees, update
)

router.route('/').get(authSecurity, checkEmployees, get)
router.route('/').get(authSecurity, checkEmployees, deleted)

export default router
