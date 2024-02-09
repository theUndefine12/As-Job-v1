import express from 'express'
import { check } from 'express-validator'
import { create, deleteCountry, getAll, getOne } from '../../controllers/country/country.controller.js'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkAdmin } from '../../Middlewares/admin.middleware.js.js'



const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty()
    ],
    authSecurity, checkAdmin, create
)

router.route('/').get(authSecurity, getAll)
router.route('/:id').get(authSecurity, getOne)
router.route('/:id').delete(authSecurity, checkAdmin, deleteCountry)

export default router
