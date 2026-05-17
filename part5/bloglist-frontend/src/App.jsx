import { useState, useEffect } from 'react'
import {
  BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import singleBlog from './components/singleBlog'

const LoginView = ({ user, username, password, setUsername, setPassword, handleLogin }) => {
  if (user) return <Navigate to="/" />
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
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
      <h2>Create New Blog</h2>
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
      <div>
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <nav>
          <Link to="/">blogs</Link>
          {' '}
          {user ? (
            <>
              <Link to="/create">create new blog</Link>
              {' '}
              <button onClick={handleLogout}>logout</button>
              <br />
              <span>{user.name} logged in</span>
              {' '}
            </>
          ) : (
            <Link to="/login">login</Link>
          )}
        </nav>

        <h2>blogs</h2>

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
      </div>
    </BrowserRouter>
  )
}

export default App