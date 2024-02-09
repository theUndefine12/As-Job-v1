import express from 'express'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js.js'
import { createDirection, getDirection, getDirections } from '../../controllers/direction/direction.controller.js'
import { check } from 'express-validator'



const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('category', 'Category is required').notEmpty()
    ],
    authSecurity, checkAdmin, createDirection
)

router.route('/').get(authSecurity, getDirections)
router.route('/:id').get(authSecurity, getDirection)


export default router

