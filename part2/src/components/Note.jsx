import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!note) {
    return <p>Note not found</p>
  }

  const label = note.important
    ? 'make not important'
    : 'make important'

  const handleDelete = async () => {
    const ok = window.confirm('Delete this note?')

    if (ok) {
      await deleteNote(id)
      navigate('/notes')
    }
  }

  return (
    <div>
      <p>{note.content}</p>

      <button onClick={() => toggleImportance(id)}>
        {label}
      </button>

      <button onClick={handleDelete}>
        delete
      </button>
    </div>
  )
}

export default Note