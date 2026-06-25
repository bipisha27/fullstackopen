import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAddComment } from '../hooks/useBlogs'

const BlogCard = styled.div`
  background: white;
  padding: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2em auto;
`

const Title = styled.h2`
  color: #333;
  margin-bottom: 0.5em;
`

const InfoRow = styled.p`
  color: #555;
  margin: 0.5em 0;
`

const Url = styled.a`
  color: #4a90e2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const LikeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 1em 0;
`

const LikeButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.4em 1em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background: #357abd;
  }
`

const CommentButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.4em 1em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-left: 0.5em;

  &:hover {
    background: #357abd;
  }
`

const CommentInput = styled.input`
  padding: 0.4em 0.5em;
`

const DeleteButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.4em 1em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background: #c0392b;
  }
`

const SingleBlog = ({ blogs, user, handleLike, handleDelete }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) return <Navigate to="/" />

  const isCreator =
    user && String(blog.user?.id || blog.user) === String(user.id)

  const [comment, setComment] = useState('')

  const addCommentMutation = useAddComment()

  const handleComment = async (event) => {
    event.preventDefault()

    await addCommentMutation.mutateAsync({
      id: blog.id,
      comment,
    })

    setComment('')
  }

  return (
    <BlogCard>
      <Title>{blog.title}</Title>
      <InfoRow>
        <Url href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </Url>
      </InfoRow>
      <LikeRow>
        <span>{blog.likes} likes</span>
        {user && <LikeButton onClick={() => handleLike(blog)}>like</LikeButton>}
      </LikeRow>
      <InfoRow>Added by {blog.user?.name}</InfoRow>

      <h3>Comments</h3>

      <form onSubmit={handleComment}>
        <CommentInput
          placeholder="add a comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <CommentButton type="submit">ADD COMMENT</CommentButton>
      </form>

      <ul>
        {blog.comments?.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      {isCreator && (
        <DeleteButton onClick={() => handleDelete(blog, navigate)}>
          remove
        </DeleteButton>
      )}
    </BlogCard>
  )
}

export default SingleBlog
