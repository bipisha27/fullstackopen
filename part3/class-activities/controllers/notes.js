const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {username: 1, name: 1})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })
  const savedNote = await note.save()
  console.log('saved note: ', savedNote)
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  try {
    const token = getTokenFrom(request)
    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }
    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
      return response.status(401).json({ error: 'token invalid' })
    }
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const note = await Note.findById(request.params.id)
    if (!note) {
      return response.status(404).end()
    }

    console.log('note.user:       ', note.user)
    console.log('decodedToken.id: ', decodedToken.id)
    console.log('match:           ', note.user && note.user.toString() === decodedToken.id.toString())

    if (!note.user || note.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: 'not authorized' })
    }

    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(error) {
    console.error('DELETE error:', error.message)
    response.status(500).json({ error: error.message })
  }
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body
  try {
    const note = await Note.findById(request.params.id)
    if (!note) {
      return response.status(404).end()
    }
    note.content = content
    note.important = important
    const updatedNote = await note.save()
    response.json(updatedNote)
  } catch (error) {
    response.status(400).end()
  }
})

module.exports = notesRouter
