import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SingleBlog from './SingleBlog'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'

const renderSingleBlog = (blog, user) => {
  render(
    <MemoryRouter initialEntries = {[`/blogs/${blog.id}`]}>
      <Routes>
        <Route 
          path="/blogs/:id"
          element={
            <SingleBlog
              blogs = {[blog]}
              user = {user}
              handleLike = {vi.fn()}
              handleDelete = {vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

const blog = {
  id: '1',
  title: 'Test Blog',
  author: 'Test Author',
  url: 'https://test.com',
  likes: 5,
  user: {
    id: 'user1',
    name: 'Blog Creator',
    username: 'creator'
  }
}

test('unauthenticated users see blog info and likes but no buttons', () => {
  renderSingleBlog(blog, null)

  expect(screen.getByText('Test Blog')).toBeDefined()
  expect(screen.getByText('https://test.com')).toBeDefined()
  expect(screen.getByTestId('likes')).toBeDefined()

  expect(screen.queryByRole('button', {name: /like/i})).toBeNull()
  expect(screen.queryByRole('button', {name: /remove/i})).toBeNull()
})

test('authenticated non-creator sees onoly the like button', () => {
  const otherUser = {id: 'user2', name:'Other User', username: 'other'}
  renderSingleBlog(blog, otherUser)

  expect(screen.getByRole('button', {name: /like/i})).toBeDefined()

  expect(screen.queryByRole('button', {name: /remove/i})).toBeNull()
})

test('the blog creator sees both like and delete buttons', () => {
  const creator = {id:'user1', name:'Blog Creator', username: 'creator'}
  renderSingleBlog(blog, creator)

  expect(screen.getByRole('button', {name: /like/i})).toBeDefined()
  expect(screen.getByRole('button', {name: /remove/i})).toBeDefined()
})