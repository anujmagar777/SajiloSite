import app from './app.js'
import connectDb from './config/db.js'

const port = process.env.PORT || 5000

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
