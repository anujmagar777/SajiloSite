import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Website from '../models/website.model.js'

dotenv.config()

const uri = process.env.MONGODB_URL

async function list() {
  try {
    console.log('Connecting to', uri)
    await mongoose.connect(uri)
    const sites = await Website.find().lean()
    console.log(`Found ${sites.length} websites:`)
    sites.forEach(s => {
      console.log('---')
      console.log('id:', s._id)
      console.log('title:', s.title)
      console.log('user:', s.user)
      console.log('deployed:', s.deployed)
      console.log('slug:', s.slug)
      console.log('createdAt:', s.createdAt)
    })
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error(err && err.message ? err.message : err)
    process.exit(1)
  }
}

list()
