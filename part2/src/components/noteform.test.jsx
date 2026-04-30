import {render, screen} from '@testing-library/react'
import Noteform from './noteform'
import userEvent from '@testing-library/user-event'

test('<Noteform /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<Noteform createNote={createNote} />)

  const input = screen.getByRole('textbox')
  // const input = screen.getByLabelText('content')
  // const input = screen.getByPlaceholderText('write note content here')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls);
  
  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})