import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/sajilo'

async function test() {
  try {
    console.log('Testing MongoDB connection to:', uri)
    await mongoose.connect(uri, { connectTimeoutMS: 5000 })
    console.log('SUCCESS: Connected to MongoDB')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('FAIL: Could not connect to MongoDB')
    console.error(err && err.message ? err.message : err)
    process.exit(1)
  }
}

test()
