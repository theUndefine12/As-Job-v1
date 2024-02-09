import express from 'express'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkEmployer } from '../../Middlewares/employer.middleware.js'
import { get } from '../../controllers/favorite/favorite.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, checkEmployer, get)


export default router
