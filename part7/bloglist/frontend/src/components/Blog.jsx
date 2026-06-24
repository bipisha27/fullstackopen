import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const currentUser = JSON.parse(localStorage.getItem('loggedBlogAppUser'))
  const blogUserId = String(blog.user?.id || blog.user?._id || blog.user)
  const currentUserId = String(currentUser?.id || currentUser?._id)
  const showDelete = currentUser && blogUserId === currentUserId

  return (
    <div style={blogStyle} className="blogItem">
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="togglableContent">
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showDelete && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
