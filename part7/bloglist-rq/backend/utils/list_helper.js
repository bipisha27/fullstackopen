const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const dummy = (blogs) => {
  return 1
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]

  for (const blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const count = {}

  blogs.forEach((blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in count) {
    if (count[author] > maxBlogs) {
      maxBlogs = count[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = {}

  blogs.forEach((blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likes) {
    if (likes[author] > maxLikes) {
      maxLikes = likes[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
