import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import useNotify from './hooks/useNotify'

const App = () => {
  const queryClient = useQueryClient()
  const {notify} = useNotify()

  const result = useQuery(
    {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false 
    }
)
   const newAnecdoteMutation = useMutation (
    {
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']
      })
      notify(`anecdote '${newAnecdote.content}' added`)
    },
    onError: (error) => {
      notify(`too short anecdote, must have length 5 or more`)
    }
  })

  const updateAnecdoteMutation = useMutation(
    {
      mutationFn: updateAnecdote,
      onSuccess: (updatedAnecdote) => {
        queryClient.invalidateQueries({queryKey: ['anecdotes']})
        notify(`anecdote '${updatedAnecdote.content}' updated`)
      }
    }
  )

  const addAnecdote = (content) => {
    newAnecdoteMutation.mutate({content, votes: 0})
  }

  const handleVoteCount = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  if(result.isPending) {
    return <div>loading data ...</div>
  }

  if(result.isError){
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = [...result.data].sort((a,b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVoteCount(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App