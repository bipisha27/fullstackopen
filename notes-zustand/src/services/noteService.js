const update = async (id, note) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(note)
  })

  if(!response.ok){
    throw new Error('Failed to update note')
  }

  return await response.json()
}

export default {getAll, createNew, update}