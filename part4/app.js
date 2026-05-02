const express = require('express')
const Blog = require('./models/blog')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

module.exports = app
