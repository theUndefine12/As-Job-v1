import express from 'express'
import { authSecurity } from '../../Middlewares/Auth.js'
import { checkEmployer } from '../../Middlewares/Employer.js'
import { get } from './favorite.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, checkEmployer, get)


export default router
