import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

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
      showNotification(null)
    } catch {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      showNotification(
        `a new blog "${returnedBlog.title}" by "${returnedBlog.author}" added`,
        'success'
      )
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

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by "${blog.author}"?`
    )
    if (!confirmDelete) return
    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  return (
    <div>
      {notification && <div>{notification.message}</div>}
      {user === null ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
