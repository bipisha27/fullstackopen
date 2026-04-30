import {useState} from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
  event.preventDefault()
  createBlog({
    title: newTitle,
    author: newAuthor,
    url: newUrl
  })
  }

  return(
    <div>
      <h3>Create New Blog</h3>

      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input name = "title" value = {newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        
         <div>
          author
          <input
            name = "author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </div>

        <div>
          url
          <input
            name = "url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm