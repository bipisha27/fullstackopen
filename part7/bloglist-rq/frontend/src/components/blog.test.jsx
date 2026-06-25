import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'React',
    author: 'Michael Brown',
    url: 'https://react.com',
    likes: 7,
  }

  render(<Blog blog={blog} />)

  const titleAuthor = screen.getByText('React Michael Brown')
  expect(titleAuthor).toBeDefined()

  const url = screen.queryByText('https://react.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('7')
  expect(likes).toBeNull()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'React',
    author: 'Michael Brown',
    url: 'https://react.com',
    likes: 7,
    user: { username: 'test' },
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()

  const button = screen.getByText('view')

  await user.click(button)

  const url = screen.getByText('https://react.com')
  expect(url).toBeVisible()

  const likes = screen.getByText('likes: 7')
  expect(likes).toBeVisible()
})

test('clicking like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'React',
    author: 'Michael Brown',
    url: 'https://react.com',
    likes: 7,
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
