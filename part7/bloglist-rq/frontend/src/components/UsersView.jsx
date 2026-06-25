import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useUsers } from '../hooks/useBlogs'

const Container = styled.div`
  padding: 1em 2em;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;

  th {
    text-align: left;
    padding: 0.8em 0.5em;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }

  td {
    padding: 0.8em 0.5em;
    border-bottom: 1px solid #eee;
  }

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

const UsersView = () => {
  const result = useUsers()

  if (result.isLoading)
    return <div style={{ padding: '2em' }}>loading users ....</div>
  if (result.isError)
    return <div style={{ padding: '2em' }}>failed to load users</div>

  const users = result.data

  return (
    <Table>
      <thead>
        <tr>
          <th>name</th>
          <th>username</th>
          <th>blogs created</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UsersView
