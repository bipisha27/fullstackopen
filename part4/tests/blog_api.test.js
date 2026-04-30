const mongoose = require('mongoose')
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)

  const user = new User({
    username: 'testuser',
    passwordHash
  })

  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret'
    })

  token = loginResponse.body.token
})

after(async () => {
  await mongoose.connection.close()
})