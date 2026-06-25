import { useParams, Navigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useUsers } from '../hooks/useBlogs'

const Container = styled.div`
  padding: 1em 2em;
`

const BlogList = styled.ul`
  list-style-type: disc;
  padding-left: 1em;
  margin-top: 1em;

  li {
    padding: 0.5em 0;
    border-bottom: 1px solid #eee;
  }
`

const UserView = () => {
  const { id } = useParams()
  const result = useUsers()

  if (result.isLoading) return <Container>loading ....</Container>
  if (result.isError) return <Container>failed to load user</Container>

  const user = result.data.find((u) => u.id === id)

  return (
    <Container>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <BlogList>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </BlogList>
    </Container>
  )
}

export default UserView
