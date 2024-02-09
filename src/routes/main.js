import express from 'express'
import adminRoutes from '../routes/admin/admin.routes.js'
import employeesRoutes from '../routes/employees/employees.routes.js'
import employerRoutes from '../routes/employer/employer.routes.js'
import countryRoutes from '../routes/country/country.routes.js'
import categoryRoutes from '../routes/category/category.routes.js'
import favoriteRoutes from '../routes/favorite/favorite.routes.js'
import resumeRoutes from '../routes/resume/resume.routes.js'
import noticeRoutes from '../routes/notice/notice.routes.js'
import vacationRoutes from '../routes/vacation/vacation.routes.js'
import directionRoutes from '../routes/direction/direction.routes.js'


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

export default routes