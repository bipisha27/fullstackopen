import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import Notification from './components/notification'
import LoginForm from './components/loginform'
import NoteForm from './components/noteform'
import NoteList from './components/NoteList'
import Note from './components/Note'
import Home from './components/home'
import Togglable from './components/togglable'
import loginService from './services/login'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      console.log(JSON.stringify(initialNotes, null, 2))
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)

    const changedNote = {
      ...note,
      important: !note.important
    }

    noteService.update(id, changedNote)
      .then(returned => {
        setNotes(prev =>
          prev.map(n => n.id !== id ? n : returned)
        )
      })
  }

  const addNote = noteObject => {
    noteFormRef.current.toggleVisibility()

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      navigate('/')
    })
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    navigate('/login')
  }

const deleteNote = async(id) => {
  try{
    await noteService.remove(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  } catch(error) {
    console.error('Delete failed', error)
  }
}

  const padding = { padding: 5 }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const match = useMatch('/notes/:id')

  const note = match && notes.length > 0
    ? notes.find(n => n.id === match.params.id)
    : null 

  console.log(match)
  console.log(note)

  return (
    <div>

    <div>
      <Link style={padding} to="/">home</Link>

      <Link style={padding} to="/notes">notes</Link>

      {user
        ? <button onClick={handleLogout}>logout</button>
        : <Link style={padding} to="/login">login</Link>
      }

      {user && <Link style={padding} to="/create">new note</Link>}
    </div> 

      <Notification message={errorMessage} />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/notes" element={ 
          <NoteList 
            notes={notesToShow} 
            toggleImportance={toggleImportance}
            deleteNote={deleteNote}
            showAll={showAll}
            setShowAll={setShowAll} 
            />
         } />

        <Route path="/notes/:id" element={
          <Note 
            note={note} 
            toggleImportance={toggleImportance} 
            deleteNote={deleteNote}
          />
        } />

        <Route path="/login" element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        } />

        <Route path="/create" element={
          user
            ? <Togglable buttonLabel="new note" ref={noteFormRef}>
                <NoteForm createNote={addNote} />
              </Togglable>
            : <p>Please <Link to="/login">login</Link> first.</p>
        } />

      </Routes>
    </div>
  )
}

export default App