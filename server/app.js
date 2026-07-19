import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import websiteRouter from './routes/website.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173'
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use('/api/auth', authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)

export default app
