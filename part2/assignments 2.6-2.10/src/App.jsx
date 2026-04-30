import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './Components/Notification'
import Person from './models/persons.js'

const Filter = ({ searchTerm, handleSearch }) => (
  <div>
    filter shown with <input value={searchTerm} onChange={handleSearch} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleName, newNumber, handleNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </li>
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearch] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(() => {
        setNotification({ message: 'Failed to fetch data from server', type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook. Replace the old number with new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== existingPerson.id ? p : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
            setSearch('')

            setNotification({ message: `Updated ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => setNotification({ message: null, type: null }), 3000)
          })
          .catch(() => {
            setNotification({
              message: `Information of ${existingPerson.name} has already been removed from server`,
              type: 'error'
            })

            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => setNotification({ message: null, type: null }), 5000)
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSearch('')

        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 3000)
      })
      .catch(() => {
        setNotification({ message: `Failed to add ${newName}`, type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    personService.remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))

        setNotification({ message: `Deleted ${name}`, type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 3000)
      })
      .catch(() => {
        setNotification({ message: `Failed to delete ${name}`, type: 'error' })
        
      })
  }

  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
  const handleSearch = (event) => setSearch(event.target.value)

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />

      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleName={handleName}
        newNumber={newNumber}
        handleNumber={handleNumber}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App