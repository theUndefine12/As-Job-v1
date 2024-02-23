import epxress from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { authVerify, getEmployee, getEmployees, getProfile, myResponces, signIn, signUp, update } from '../../controllers/employees/employees.controller.js'
import { checkEmployees } from '../../Middlewares/employees.middleware.js'



const router = epxress.Router()

router.route('/signup').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('country', 'Name is required').notEmpty(),
        check('phone', 'Phone is required').notEmpty(),
        check('gender', 'Gender is required and need be Male or Female').notEmpty(),
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
        check('phone', 'Phone is required').notEmpty(),
        check('password', 'Password is required and need be minimum 8').isLength({ min: 8 })
    ],
    signIn
)
router.route('/update').put(
    [
        check('name', 'Name is required').optional().notEmpty(),
        check('email', 'Email is required').optional().notEmpty(),
        check('country', 'Country is required').optional().notEmpty(),
        check('phone', 'Phone is required').optional().notEmpty(),
        check('password', 'Password is required and need be minimum 8').optional().isLength({ min: 8 })
    ],
    authSecurity, checkEmployees, update
)

router.route('/profile').get(authSecurity, getProfile)
router.route('/responces').get(authSecurity, checkEmployees, myResponces)
router.route('/').get(getEmployees)
router.route('/:id').get(authSecurity, getEmployee)


export default router

