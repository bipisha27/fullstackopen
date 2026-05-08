const mongoose = require('mongoose')
require('dotenv').config()

const Note = require('./models/note') 

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('connected')
  

  const notes = await Note.find({})
  console.log(notes.map(n => ({ id: n._id, content: n.content, user: n.user })))


  const result = await Note.updateMany(
    { user: null },
    { $set: { user: new mongoose.Types.ObjectId('69ef2fd6d2ef3a76b43f0b4f') } }
  )
  console.log('Fixed:', result.modifiedCount, 'notes')

  mongoose.connection.close()
})
