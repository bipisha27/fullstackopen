const mongoose = require('mongoose')
const config = require('../utils/config')

const connectDB = async () => {
  await mongoose.connect(config.MONGODB_URI)
}

const closeDB = async () => {
  await mongoose.connection.close()
}

module.exports = { connectDB, closeDB }
