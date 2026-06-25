import { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import SingleBlog from './components/SingleBlog'
import styled from 'styled-components'
import ErrorBoundary from './components/ErrorBoundary'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'
import useBlogStore from './stores/blogStore'

const FormWrapper = styled.div`
  background: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
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
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`

const NavLinks = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1.5em;
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
  background: ${(props) => (props.type === 'error' ? '#ffe0e0' : '#e0ffe0')};
  color: ${(props) => (props.type === 'error' ? '#c0392b' : '#27ae60')};
  border: 2px solid
    ${(props) => (props.type === 'error' ? '#c0392b' : '#27ae60')};
`
const LogoutLink = styled.button`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`
const BlogItem = styled.li`
  margin-bottom: 0.5em;
  a {
    color: #4a90e2;
    text-decoration: none;
    font-size: 1.1em;
    &:hover {
      text-decoration: underline;
    }
  }
`

const LoginView = ({
  user,
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  if (user) return <Navigate to="/" />
  return (
    <FormWrapper>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <FormRow>
          <Label>username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Label>password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormRow>
        <Button type="submit">login</Button>
      </form>
    </FormWrapper>
  )
}
const BlogList = ({ blogs }) => {
  // throw new Error('simulated error')

  return (
    <ul style={{ padding: '1em 2em' }}>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogItem key={blog.id} className="blogItem">
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </BlogItem>
        ))}
    </ul>
  )
}

const NotFound = () => (
  <div style={{ padding: '2em' }}>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/">Go back to blogs</Link>
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
  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const addBlogToStore = useBlogStore((state) => state.addBlog)
  const updateBlogInStore = useBlogStore((state) => state.updateBlog)
  const removeBlogFromStore = useBlogStore((state) => state.removeBlog)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)

  const notification = useNotificationStore((state) => state.notification)
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  )

  const [loginMessage, setLoginMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    initializeBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setLoginMessage(`${user.name} logged in`)
      setTimeout(() => setLoginMessage(null), 5000)
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    clearUser()
    blogService.setToken(null)
  }

  const addBlog = async (blogObject, navigate) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      addBlogToStore(returnedBlog)
      showNotification(
        `a new blog "${returnedBlog.title}" by "${returnedBlog.author}" added`,
        'success'
      )
      navigate('/')
    } catch {
      showNotification('failed to add blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    updateBlogInStore(returnedBlog)
  }

  const handleDelete = async (blog, navigate) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by "${blog.author}"?`
    )
    if (!confirmDelete) return
    await blogService.remove(blog.id)
    removeBlogFromStore(blog.id)
    navigate('/')
  }

  return (
    <BrowserRouter>
      <Page>
        <NavBar>
          <h1 style={{ color: 'white', margin: 0 }}>BLOGS APP</h1>
          <NavLinks>
            <Link to="/">Blogs</Link>
            {user ? (
              <>
                <Link to="/create">New Blog</Link>
                <LogoutLink onClick={handleLogout}>Logout</LogoutLink>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </NavLinks>
        </NavBar>

        {loginMessage && (
          <p
            style={{
              padding: '0.5em 1em',
              color: '#27ae60',
              fontWeight: 'bold',
            }}
          >
            {loginMessage}
          </p>
        )}

        {notification && (
          <NotificationBox type={notification.type}>
            {notification.message}
          </NotificationBox>
        )}

        <h2 style={{ padding: '0.5em 1em' }}>blogs</h2>

        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogList blogs={blogs} />} />
            <Route
              path="/login"
              element={
                <LoginView
                  user={user}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                />
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <SingleBlog
                  blogs={blogs}
                  user={user}
                  handleLike={handleLike}
                  handleDelete={handleDelete}
                />
              }
            />
            <Route
              path="/create"
              element={<CreateBlog user={user} addBlog={addBlog} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Page>
    </BrowserRouter>
  )
}

export default App
