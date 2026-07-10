import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { changes, deploy, generateWebsite, getAll, getBySlug, getWebsiteById } from '../controllers/website.controller.js'
import Website from '../models/website.model.js'

const websiteRouter = express.Router()

websiteRouter.post('/generate', isAuth, generateWebsite)
websiteRouter.post('/update/:id', isAuth, changes)
websiteRouter.get('/get-by-id/:id', isAuth, getWebsiteById)
websiteRouter.get('/get-all', isAuth, getAll)
websiteRouter.get('/deploy/:id', isAuth, deploy)
websiteRouter.get('/get-by-slug/:slug', isAuth, getBySlug)
websiteRouter.delete('/:id', isAuth, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id)
    if (!website) {
      return res.status(404).json({ message: 'Website not found' })
    }
    if (website.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await Website.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Website deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: `Delete website error: ${error}` })
  }
})
export default websiteRouter
