const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const decodedToken = req.token
    ? jwt.verify(req.token, process.env.SECRET)
    : null
  if (!decodedToken) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    ...body,
    likes: body.likes ?? 0,
    user: user._id,
    comments: [],
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  res.status(201).json(populatedBlog)
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

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body
  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes value missing' })
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true }
    ).populate('user', { username: 1, name: 1, id: 1 })
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: 'Invalid blog ID' })
  }
})

blogsRouter.post('/:id/comments', async (req, res) => {
  const { comment } = req.body
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments.concat(comment)

  const savedBlog = await blog.save()

  res.status(201).json(savedBlog)
})

module.exports = blogsRouter
