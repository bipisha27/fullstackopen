import {Link} from 'react-router-dom'

const NoteList = ({notes}) => {
  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  )
}
export default NoteList