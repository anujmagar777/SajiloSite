import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDb from './config/db.js'
import authRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import websiteRouter from './routes/website.routes.js'

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173'
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use('/api/auth', authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)

const startServer = async () => {
    try {
        await connectDb()
        app.listen(port, '0.0.0.0', ()=>{
            console.log(`Server started on http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Failed to start server')
        process.exit(1)
    }
}

startServer()