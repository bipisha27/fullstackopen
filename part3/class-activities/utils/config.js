require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

console.log('ENV loaded:', MONGODB_URI ? 'yes' : 'no')
console.log('PORT:', PORT ? 'yes' : 'no')

module.exports = {
  MONGODB_URI,
  PORT,
}