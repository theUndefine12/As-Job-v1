import epxress from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { authVerify, getProfile, myVacations, signIn, signUp } from '../../controllers/employer/employer.controller.js'
import { checkEmployer } from '../../Middlewares/employer.middleware.js'



const router = epxress.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('phone', 'Phone is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signUp
)

router.route('/verify').post(
    [
        check('phone', 'Phone is required').notEmpty(),
        check('code', 'Code is required').notEmpty()
    ],
    authVerify
)

router.route('/signin').post(
    [
        check('phone', 'Email is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signIn
)
router.route('/profile').get(authSecurity, checkEmployer, getProfile)
router.route('/vacations').get(authSecurity, checkEmployer, myVacations)

export default router

