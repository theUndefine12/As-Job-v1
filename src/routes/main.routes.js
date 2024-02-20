import express from 'express'
import adminRoutes from './admin/admin.routes.js'
import employeesRoutes from './employees/employees.routes.js'
import employerRoutes from './employer/employer.routes.js'
import countryRoutes from './country/country.routes.js'
import categoryRoutes from './category/category.routes.js'
import favoriteRoutes from './favorite/favorite.routes.js'
import resumeRoutes from './resume/resume.routes.js'
import noticeRoutes from './notice/notice.routes.js'
import vacationRoutes from './vacation/vacation.routes.js'
import directionRoutes from './direction/direction.routes.js'
import chatRoutes from './chat/chat.routes.js'
import searchRoutes from './search/search.routes.js'
import filterRoutes from './filter/filter.routes.js'

const routes = express()


routes.use('/admin', adminRoutes)
routes.use('/employees', employeesRoutes)
routes.use('/employer', employerRoutes)
routes.use('/country', countryRoutes)
routes.use('/category', categoryRoutes)
routes.use('/favorite', favoriteRoutes)
routes.use('/resume', resumeRoutes)
routes.use('/notice', noticeRoutes)
routes.use('/vacation', vacationRoutes)
routes.use('/direction', directionRoutes)
routes.use('/chat', chatRoutes)
routes.use('/search', searchRoutes)
routes.use('/filter', filterRoutes)


export default routes