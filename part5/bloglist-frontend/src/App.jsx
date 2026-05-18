import { useState, useEffect } from 'react'
import {
  BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import styled from 'styled-components'

const FormWrapper = styled.div`
  background: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 400px;
  margin: 2em auto;
`

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.3em;
  color: #333;
`

const Input = styled.input`
  padding: 0.5em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
  }
`

const Button = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.6em 1.5em;
  font-size: 1em;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5em;
  &:hover {
    background: #357abd;
  }
`

const NavBar = styled.nav`
  background: #4a90e2;
  padding: 1em;
  display: flex;
  align-items: center;
  gap: 1em;
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    &:hover { text-decoration: underline; }
  }
  button {
    background: transparent;
    color: white;
    border: 1px solid white;
    padding: 0.3em 0.8em;
    border-radius: 4px;
    cursor: pointer;
    &:hover { background: rgba(255,255,255,0.2); }
  }
  span { color: white; }
`

const Page = styled.div`
  font-family: sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
`
const NotificationBox = styled.div`
  padding: 0.8em 1.2em;
  margin: 1em;
  border-radius: 6px;
  font-weight: bold;
  font-weight: bold;
  background: ${props => props.type === 'error' ? '#ffe0e0' : '#e0ffe0'};
  color: ${props => props.type === 'error' ? '#c0392b' : '#27ae60'};
  border: 2px solid ${props => props.type === 'error' ? '#c0392b' : '#27ae60'};
`

const LoginView = ({ user, username, password, setUsername, setPassword, handleLogin }) => {
  if (user) return <Navigate to="/" />
  return (
    <FormWrapper>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <FormRow>
          <Label>username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormRow>
        <FormRow>
          <Label>password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormRow>
        <Button type="submit">login</Button>
      </form>
    </FormWrapper>
  )
}

const BlogList = ({ blogs }) => (
  <div>
    {blogs
      .slice()
      .sort((a, b) => b.likes - a.likes)
      .map(blog => (
        <div key={blog.id} style={{
          paddingTop: 10, paddingLeft: 2,
          border: 'solid', borderWidth: 1, marginBottom: 5
        }} className="blogItem">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      ))}
  </div>
)


const CreateBlog = ({ user, addBlog }) => {
  const navigate = useNavigate()
  if (!user) return <Navigate to="/login" />
  return (
    <div>
      <BlogForm createBlog={(blogObject) => addBlog(blogObject, navigate)} />
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject, navigate) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog "${returnedBlog.title}" by "${returnedBlog.author}" added`, 'success')
      navigate('/')
    } catch {
      showNotification('failed to add blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }

  const handleDelete = async (blog, navigate) => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)
    if (!confirmDelete) return
    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
    navigate('/')
  }

  return (
  <BrowserRouter>
    <Page>
      {notification && (
        <NotificationBox type={notification.type}>
          {notification.message}
        </NotificationBox>
      )}

      <NavBar>
        <Link to="/">BLOGS</Link>
        {user ? (
          <>
            <Link to="/create">NEW BLOG</Link>
            <button onClick={handleLogout}>logout</button>
            <span>{user.name} logged in</span>
          </>
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
      </NavBar>

      <h2 style={{ padding: '0.5em 1em' }}>blogs</h2>

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/login" element={
          <LoginView
            user={user}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />}
        />
        <Route path="/blogs/:id" element={
          <SingleBlog
            blogs={blogs}
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />}
        />
        <Route path="/create" element={
          <CreateBlog user={user} addBlog={addBlog} />}
        />
      </Routes>
    </Page>
  </BrowserRouter>
  )
}

export default App