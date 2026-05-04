import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Notification from './components/notification'
import LoginForm from './components/loginform'
import NoteForm from './components/noteform'
import NoteList from './components/NoteList'
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

  const addNote = noteObject => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject).then(returnedNote => {
      setNotes(prevNotes => prevNotes.concat(returnedNote))
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

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        {user
          ? <button onClick={handleLogout}>logout</button>
          : <Link style={padding} to="/login">login</Link>
        }
        {user && <Link style={padding} to="/create">new note</Link>}
      </div>

      <Notification message={errorMessage} />

      <Routes>
        <Route path="/" element={<NoteList notes={notes} />} />

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