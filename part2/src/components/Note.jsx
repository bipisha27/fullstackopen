import { useParams } from 'react-router-dom'

const Note = ({ note, toggleImportance }) => {
  const { id } = useParams()

  if (!note) {
    return <div> note not found </div>
  }

  const label = note.important
    ? 'make not important'
    : 'make important'

  const handleDelete = async() => {
    const ok = window.confirm(`Delete note "${note.content}"?`)

    if(ok){
      await deleteNote(note.id)
      navigate('/notes')
    }
  }

  return (
    <div>
      <h2>{note.content}</h2>

      <button onClick={() => toggleImportance(id)}>
        {label}
      </button>
      <button onClick={handleDelete} style={{marginLeft:'10px', color:'red'}}>
        delete
      </button>
    </div>
  )
}

export default Note