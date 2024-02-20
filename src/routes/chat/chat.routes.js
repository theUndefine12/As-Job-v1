import express from 'express'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { clearHistory, deleteChat, deleteMessage, getChat, getChats, sendMessage } from '../../controllers/chat/chat.controller.js'
import { check } from 'express-validator'



const router = express.Router()

router.route('/').get(authSecurity, getChats)
router.route('/:id').get(authSecurity, getChat)
router.route('/:id/send-message').post(
    [
        check('text', 'Text is required').notEmpty()
    ],
    authSecurity, sendMessage
)


router.route('/:id/:msgId/remove').post(authSecurity, deleteMessage)
router.route('/:id/clear-history').post(authSecurity, clearHistory)
router.route('/:id').delete(authSecurity, deleteChat)


export default router
