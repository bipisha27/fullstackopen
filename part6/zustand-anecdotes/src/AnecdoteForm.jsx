import {useState} from 'react'
import { useAnecdoteActions } from './store'

const AnecdoteForm = () => {
  const [newAnecdote, setNewAnecdote] = useState('')
  const {addAnecdote} = useAnecdoteActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value 
    await addAnecdote(anecdote)
    e.target.reset()
  }

  return(
    <form onSubmit={handleSubmit}>
      <input
        name = "anecdote"
        value = {newAnecdote}
        onChange = {(e) => setNewAnecdote(e.target.value)}
      />

      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm