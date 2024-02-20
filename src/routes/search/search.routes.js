import express from 'express'
// import { authSecurity } from '../../Middlewares/auth.middleware'
import { searcVacation, searchEmployees } from '../../controllers/search/search.controller.js'


const router = express.Router()

router.route('/vacation').get(searcVacation)
router.route('/employees').get(searchEmployees)


export default router

