import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import useNotificationStore from './notification'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],

  filter: '',

  actions: {
    voteAnecdote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      const returned = await anecdoteService.update(id, updatedAnecdote)

      set(state => ({
        anecdotes: state.anecdotes.map(a => 
          a.id === id? returned : a
        )
      }))

      useNotificationStore.getState().setNotification(
        `you voted '${anecdote.content}'`
      )
    },
      
     addAnecdote: async (anecdote) =>{
      const newAnecdote = await anecdoteService.createNew(anecdote)

      set(state => ({
        anecdotes : state.anecdotes.concat(newAnecdote)
      }))

      useNotificationStore.getState().setNotification(
        `you create '${anecdote.content}'`
      )
    },
    
    setFilter: value => 
      set(() => ({
        filter: value
      })),

    fetchAnecdotes: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({anecdotes})
    },

    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    }
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)

export const useFilter = () => useAnecdoteStore((state) => state.filter)

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore

export const notificationActions = {
  setNotification: (set, message) => {
    set({message})

    setTimeout(() => {
      set({message: ''})
    }, 5000)
  }
}