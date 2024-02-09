import express from 'express'
import 'colors'
import dotenv from 'dotenv'
import mainRoutes from './routes/main.js'

dotenv.config()


const app = express()
const port = process.env.PORT || 1111


app.use(express.json())
app.use('/api/as', mainRoutes)


app.listen(port, () => {
    console.log(`Server run on port ${port}`.italic.bgBlue)
})

