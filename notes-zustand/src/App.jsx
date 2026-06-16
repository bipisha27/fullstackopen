import {useNotes, useNoteActions} from './store'

const App = () => {
  const notes = useNotes()
  const {add} = useNoteActions()

  const generateId = () => Number((Math.random()* 1000000).toFixed(0))

  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({id: generateId(), content, important: false})
    e.target.reset()
  }

  return(
    <div>
      <NoteForm />
      <NoteList />
    </div>
  )
}

export default App 