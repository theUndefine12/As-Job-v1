import express from 'express'
import adminRoutes from '../routes/admin/admin.routes.js'
import employeesRoutes from '../routes/employees/employees.routes.js'
import employerRoutes from '../routes/employer/employer.routes.js'
import countryRoutes from '../routes/country/country.routes.js'
import categoryRoutes from '../routes/category/category.routes.js'
import favoriteRoutes from '../routes/favorite/favorite.routes.js'
import resumeRoutes from '../routes/resume/resume.routes.js'


const routes = express()


routes.use('/admin', adminRoutes)
routes.use('/employees', employeesRoutes)
routes.use('/employer', employerRoutes)
routes.use('/country', countryRoutes)
routes.use('/category', categoryRoutes)
routes.use('/favorite', favoriteRoutes)
routes.use('/resume', resumeRoutes)


export default routes