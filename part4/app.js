const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

const jwt = require('jsonwebtoken')
const User = require('./models/user')

app.post('/api/blogs', async (req, res) => {
  const body = req.body

  const decodedToken = req.token
    ? jwt.verify(req.token, 'SECRET')
    : null

  if (!decodedToken) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ...body,
    likes: body.likes ?? 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  res.status(204).end();
});

app.put('/api/blogs/:id', async (req, res) => {
  const { likes } = req.body

  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes value missing' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true }
    )

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: 'Invalid blog ID' })
  }
})


module.exports = app