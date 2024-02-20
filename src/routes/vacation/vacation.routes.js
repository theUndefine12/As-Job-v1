import express from 'express'
import { check } from 'express-validator'
import { authSecurity } from '../../Middlewares/auth.middleware.js'
import { checkEmployer } from '../../Middlewares/employer.middleware.js'
import { createVacation, deleteVacation, getResponces, getReviews, getVacation, likeVacation, myVacations, putReview, refuseEmployees, responce, sendMessageToEmloyee, showContacts, unResponce, unlikeVacation, updateVacation } from '../../controllers/vacation/vacation.controller.js'
import { getAllVAcations } from '../../controllers/admin/admin.controller.js'
import { checkEmployees } from '../../Middlewares/employees.middleware.js'


const router = express.Router()

router.route('/create').post(
    [
        check('name', 'Name is required').notEmpty(),
        check('description', 'Description is required').notEmpty(),
        check('proffesion', 'Proffesion is required').notEmpty(),
        check('salary', 'Salary is required').isNumeric(),
        check('company', 'Company is required').notEmpty(),
        check('contacts', 'Contacts is required').notEmpty(),
        check('direction', 'Direction is required').notEmpty(),
        check('conditions', 'Conditions is required').isArray().isLength({ min: 4 }),
        check('requirements', 'Requirements is required').isArray().isLength({ min: 4 }),
        check('adresse', 'Adresse is required').notEmpty(),
    ],
    authSecurity, checkEmployer, createVacation
)

router.route('/:id').put(
    [
        check('name', 'Name is required').optional().notEmpty(),
        check('description', 'Description is required').optional().notEmpty(),
        check('proffesion', 'Proffesion is required').optional().notEmpty(),
        check('salary', 'Salary is required').optional().isNumeric(),
        check('company', 'Company is required').optional().notEmpty(),
        check('contacts', 'Contacts is required').optional().notEmpty(),
        check('conditions', 'Conditions is required').optional().isArray().isLength({ min: 4 }),
        check('requirements', 'Requirements is required').optional().isArray().isLength({ min: 4 }),
        check('adresse', 'Adresse is required').optional().notEmpty(),
    ],
    authSecurity, checkEmployer, updateVacation
)

router.route('/').get(authSecurity, getAllVAcations)
router.route('/:id').get(authSecurity, getVacation)
router.route('/:id/like').post(authSecurity, checkEmployees, likeVacation)
router.route('/:id/unlike').post(authSecurity, checkEmployees, unlikeVacation)
router.route('/:id/responce').post(authSecurity, checkEmployees, responce)
router.route('/:id/unresponce').post(authSecurity, checkEmployees, unResponce)
router.route('/:id/contacts').get(authSecurity, showContacts)
router.route('/:id/reviews').get(authSecurity, getReviews)

router.route('/my/vacations').get(authSecurity, checkEmployer, myVacations)

router.route('/:id/add-reviewe').post(
    [
        check('text', 'Text is required and needd be min 5').isLength({ min: 5 })
    ],
    authSecurity, checkEmployees, putReview
)

router.route('/:id/responces').get(authSecurity, checkEmployer, getResponces)

router.route('/:id/responces/:employeeId/refuse').post(authSecurity, checkEmployer, refuseEmployees)
router.route('/:id/responces/:employeeId/approve').post(
    [
        check('text', 'Text is required').notEmpty()
    ],
    authSecurity, checkEmployer, sendMessageToEmloyee
)

router.route('/:id').delete(authSecurity, checkEmployer, deleteVacation)

export default router
