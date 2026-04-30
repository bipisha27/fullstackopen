const mongoose = require('mongoose')
const config = require('../utils/config')
const { test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})
})

test('user can be created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  assert.strictEqual(response.body.username, 'testuser')
})

after(async () => {
  await mongoose.connection.close()
})