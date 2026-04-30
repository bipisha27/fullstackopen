const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1})
    
    res.json(blogs)
 })
 
blogsRouter.delete('/:id', async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(401).json({ error: 'not authorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
