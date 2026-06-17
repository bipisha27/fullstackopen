import { useNotes, useNoteActions } from './store'
import NoteForm from './NoteForm'
import NoteList from './NoteList'
import VisibilityFilter from './VisibilityFilter'

const App = () => {
  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <NoteList />
    </div>
  )
}

export default App