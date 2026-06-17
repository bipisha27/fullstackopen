import {useFilter, useNotes} from './store'
import Note from './Note'

const NoteList = () => {
  const notes = useNotes()

  const notesToShow = notes.filter(note => {
    if(filter === 'important') return note.important
    if(filter === 'nonimportant') return !note.important 
    return true 
  })

  return(
    <ul>
      {notesToShow.map(note => (
        <Note key={note.id} note={note} />
      ))}
    </ul>
  )
}

export default NoteList