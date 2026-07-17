import serverless from 'serverless-http'
import app from '../app.js'
import connectDb from '../config/db.js'

let cachedHandler

export default async function handler(req, res) {
  if (!cachedHandler) {
    await connectDb()
    cachedHandler = serverless(app)
  }
  return cachedHandler(req, res)
}
