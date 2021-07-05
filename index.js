import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import colors from 'colors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'

dotenv.config({
  path: './config/config.env',
})
import connectDB from './config/db.js'
connectDB()
const app = express()

import auth from './routes/auth.js'
import brands from './routes/brands.js'

app.use(express.json())
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('short'))
}
const __dirname = path.resolve(path.dirname(''))
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileupload())
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, //10 min
  max: 100,
})
app.use(limiter)
app.use(hpp())
app.use(cors())

app.use('/api/v1/auth', auth)
app.use('/api/v1/brands', brands)

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Сервер запущен на порту ${PORT}... `.yellow)
)
