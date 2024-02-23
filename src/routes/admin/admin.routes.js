import epxress from 'express'
import { check } from 'express-validator'
import { getAllVAcations, getEmployees, getEmployer, getProfile, signIn, signUp } from '../../controllers/admin/admin.controller.js'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js.js'
import { checkEmployees } from '../../Middlewares/employees.middleware.js'



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
router.route('/profile').get(authSecurity,checkAdmin, getProfile)

router.route('/employees').get(authSecurity,checkAdmin, getEmployees)
router.route('/employeers').get(authSecurity,checkAdmin, getEmployer)
router.route('/vacations').get(authSecurity,checkAdmin, getAllVAcations)



export default router

