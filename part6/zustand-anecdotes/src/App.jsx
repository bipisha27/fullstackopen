import { useEffect } from "react";
import AnecdoteForm from "./AnecdoteForm";
import AnecdoteList from "./AnecdoteList";
import Filter from './Filter';
import { useAnecdoteActions } from "./store";
import Notification from "./not";

const App = () => {
  const {fetchAnecdotes} = useAnecdoteActions()

  useEffect(() => {
    fetchAnecdotes()
  }, [fetchAnecdotes])

  return(
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <Filter />
      <AnecdoteForm />
    </div>
  )
}

export default App 