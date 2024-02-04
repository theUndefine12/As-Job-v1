import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/Auth.js'
import { checkAdmin } from '../../Middlewares/Admin.js'
import { create, deleted, getAll, getOne } from './category.controller.js'



const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty()
    ],
    authSecurity, checkAdmin, create
)

router.route('/').get(authSecurity, getAll)
router.route('/:id').get(authSecurity, getOne)
router.route('/:id').delete(authSecurity, checkAdmin, deleted)

export default router
