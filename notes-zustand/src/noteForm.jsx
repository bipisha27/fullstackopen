import {useNoteActions} from './store'

const generateId = () => Number((Math.random()*1000000).toFixed(0))

const NoteForm = () => {
  const {add} = useNoteActions()

  const addNote = (e) => {
    e.preventDefault()
    const content = e.target.note.value
    add({id: generateId, content, important: false})
    e.target.reset()
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm 