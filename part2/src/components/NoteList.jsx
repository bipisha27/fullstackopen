import { Link } from 'react-router-dom'

const NoteList = ({
  notes,
  toggleImportance,
  showAll,
  setShowAll
}) => {
  return (
    <div>
      <h2>Notes</h2>

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>

      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>
              {note.content}
            </Link>

            <button onClick={() => toggleImportance(note.id)}>
              {note.important
                ? 'make not important'
                : 'make important'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoteList