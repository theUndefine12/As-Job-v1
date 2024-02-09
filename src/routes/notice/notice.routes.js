import express from 'express'
import { check } from 'express-validator'
import { checkEmployees } from '../../Middlewares/employees.middleware.js'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { clearNotice, getNotices } from '../../controllers/notice/notice.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, checkEmployees, getNotices)
router.route('/clear').post(authSecurity, checkEmployees, clearNotice)


export default router
