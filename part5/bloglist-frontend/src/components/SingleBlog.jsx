import { useParams, useNavigate, Navigate } from "react-router-dom";

const SingleBlog = ({blogs, user, handleLike, handleDelete}) => {
  const navigate = useNavigate()
  const {id} = useParams()

  const blog = blogs.find(b => b.id === id)

  if(!blog) return <Navigate to="/" />

  const isCreator = user && String(blog.user?.id || blog.user) === String(user.id)

  return(
    <div data-testid="single-blog">
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <p>
        likes: <span data-testid="likes">{blog.likes}</span>
        {user && (
          <button onClick={() => handleLike(blog)}>like</button>
        )}
      </p>
      <p>added by {blog.user?.name}</p>
      {isCreator && (
        <button onClick = {() => handleDelete(blog, navigate)}>remove</button>
      )}
    </div>
  )
}

export default SingleBlog