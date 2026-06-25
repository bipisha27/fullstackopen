import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  addBlog: (blog) => {
    set({ blogs: get().blogs.concat(blog) })
  },

  updateBlog: (updatedBlog) => {
    set({
      blogs: get().blogs.map((b) =>
        b.id !== updatedBlog.id ? b : updatedBlog
      ),
    })
  },

  removeBlog: (id) => {
    set({
      blogs: get().blogs.filter((b) => b.id !== id),
    })
  },
}))

export default useBlogStore
