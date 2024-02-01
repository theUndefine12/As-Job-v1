import epxress from 'express'
import { check } from 'express-validator'
import { getProfile, signIn, signUp } from './admin.controller.js'
import { authSecurity } from '../../Middlewares/Auth.js'



const router = epxress.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signUp
)
router.route('/signin').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signIn
)
router.route('/profile').get(authSecurity, getProfile)


export default router

