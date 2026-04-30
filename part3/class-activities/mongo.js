import { connect, Schema, model, connection } from 'mongoose'

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.rmqnfy7.mongodb.net/noteApp`

connect(url)

const noteSchema = new Schema({
  content: String,
  important: Boolean,
})

const Note = model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: false,
// })

// note.save().then(() => {
//   console.log('saved!')
//   mongoose.connection.close()
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  connection.close()
})
