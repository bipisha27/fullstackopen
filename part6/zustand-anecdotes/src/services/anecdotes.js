const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await response.json()
}

const createNew = async (anecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: anecdote,
      votes: 0
    })
  })

  if (!response.ok) {
    throw new Error('failed to create anecdote')
  }

  return await response.json()
}

const update = async (id, updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAnecdote)
  })

  return await response.json()
}

const remove = async(id) => {
  const response = await fetch(`${baseUrl}/${id}`,{
    method: 'DELETE'
  })

  if (!response.ok){
    throw new Error('failed to delete anecdote')
  }

  return id
}

export default { getAll, createNew, update, remove }