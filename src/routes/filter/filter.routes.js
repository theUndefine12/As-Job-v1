import epxpress from 'express'
import { filterEntities } from '../../controllers/filter/filter.controller.js'


const router = epxpress.Router()

router.route('/vacation').get(filterEntities)


export default router

