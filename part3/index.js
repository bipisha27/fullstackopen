import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import errorHandler from './middleware/errorhandler.js'
import Person from './models/person.js'
import 'dotenv/config'

app.get('/test', (req, res) => {
  res.send('OK WORKING')
})

const app = express()

app.use(express.json())

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

mongoose.connect(process.env.MONGODB_URI)

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => res.json(result))
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})