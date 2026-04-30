import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // const titleInput = screen.getByRole('textbox', {name: /title/i})
  // const authorInput = screen.getByRole('textbox', {name: /author/i})
  // const urlInput = screen.getByRole('textbox', {name: /url/i})

  const inputs = screen.getAllByRole('textbox')

  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const button = screen.getByText('create')

  await user.type(titleInput, 'Test Blog')
  await user.type(authorInput, 'Bipisha')
  await user.type(urlInput, 'https://test.com')

  await user.click(button)

  expect(createBlog).toHaveBeenCalledTimes(1)

  const calledWith = createBlog.mock.calls[0][0]

  expect(calledWith.title).toBe('Test Blog')
  expect(calledWith.author).toBe('Bipisha')
  expect(calledWith.url).toBe('https://test.com')
})