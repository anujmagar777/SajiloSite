import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/user.model.js'

dotenv.config()

const uri = process.env.MONGODB_URL

async function list() {
  try {
    console.log('Connecting to', uri)
    await mongoose.connect(uri)
    const users = await User.find().lean()
    console.log(`Found ${users.length} users:`)
    users.forEach(u => {
      console.log('---')
      console.log('id:', u._id)
      console.log('name:', u.name)
      console.log('email:', u.email)
      console.log('avatar:', u.avatar)
      console.log('createdAt:', u.createdAt)
    })
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error(err && err.message ? err.message : err)
    process.exit(1)
  }
}

list()
