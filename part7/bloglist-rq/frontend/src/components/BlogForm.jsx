import { useState } from 'react'
import styled from 'styled-components'

const FormWrapper = styled.div`
  background: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0, 1);
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

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
  }

  return (
    <FormWrapper>
      <h3>Create New Blog</h3>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <Label>title</Label>
          <Input
            name="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Label>author</Label>
          <Input
            name="author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Label>url</Label>
          <Input
            name="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </FormRow>
        <Button type="submit">create</Button>
      </form>
    </FormWrapper>
  )
}

export default BlogForm
