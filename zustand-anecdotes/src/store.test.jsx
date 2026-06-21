import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, render, screen, cleanup } from '@testing-library/react'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'
import AnecdoteList from './AnecdoteList'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})


describe('initialize anecdotes', () => {
  it('loads anecdotes from backend into state', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'first', votes: 0 },
      { id: 2, content: 'second', votes: 0 }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.fetchAnecdotes()
    })

    const { result: state } = renderHook(() => useAnecdotes())

    expect(state.current).toEqual(mockAnecdotes)
  })
})


describe('AnecdoteList sorting', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'A', votes: 1 },
        { id: 2, content: 'B', votes: 5 },
        { id: 3, content: 'C', votes: 3 }
      ]
    })
  })

  it('renders anecdotes sorted by votes', () => {
    render(<AnecdoteList />)

    const items = screen.getAllByTestId('anecdote')

    expect(items[0]).toHaveTextContent('B')
    expect(items[1]).toHaveTextContent('C')
    expect(items[2]).toHaveTextContent('A')
  })
})


describe('filtered anecdotes', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'React is easy', votes: 0 },
        { id: 2, content: 'Redux is difficult', votes: 0 },
        { id: 3, content: 'React hooks are useful', votes: 0 }
      ],
      filter: 'React'
    })
  })

  it('renders only filtered anecdotes', () => {
    render(<AnecdoteList />)

    const items = screen.getAllByTestId('anecdote')

    expect(items).toHaveLength(2)

    expect(screen.getByText('React is easy')).toBeInTheDocument()
    expect(screen.getByText('React hooks are useful')).toBeInTheDocument()

    expect(screen.queryByText('Redux is difficult')).toBeNull()
  })
})


describe('voting', () => {
  it('increases votes by one', async () => {
    const anecdote = {
      id: 1,
      content: 'React is great',
      votes: 0
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote]
    })

    anecdoteService.update.mockResolvedValue({
      ...anecdote,
      votes: 1
    })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.voteAnecdote(1)
    })

    const { result: anecdotes } = renderHook(() => useAnecdotes())

    expect(anecdotes.current[0].votes).toBe(1)
  })
})