const test = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('total likes when single blog', () => {
  const listWithOneBlog = [{ title: 'Blog 1', author: 'Author 1', likes: 5 }]

  const result = listHelper.totalLikes(listWithOneBlog)
  assert.strictEqual(result, 5)
})

test('total likes when multiple blogs', () => {
  const listWithMultipleBlogs = [
    { title: 'Blog 1', author: 'Author 1', likes: 5 },
    { title: 'Blog 2', author: 'Author 2', likes: 10 },
    { title: 'Blog 3', author: 'Author 3', likes: 0 },
  ]

  const result = listHelper.totalLikes(listWithMultipleBlogs)
  assert.strictEqual(result, 15)
})

test('favorite blog returns highest likes', () => {
  const blogs = [
    { title: 'Blog 1', author: 'Author 1', likes: 5 },
    { title: 'Blog 2', author: 'Author 2', likes: 10 },
    { title: 'Blog 3', author: 'Author 3', likes: 0 },
  ]

  const result = listHelper.favoriteBlog(blogs)

  assert.deepStrictEqual(result, {
    title: 'Blog 2',
    author: 'Author 2',
    likes: 10,
  })
})

test('favorite blog returns null for empty list', () => {
  const result = listHelper.favoriteBlog([])
  assert.strictEqual(result, null)
})

test('most blogs returns correct author', () => {
  const blogs = [
    { author: 'A', title: '1', likes: 5 },
    { author: 'B', title: '2', likes: 3 },
    { author: 'A', title: '3', likes: 7 },
  ]

  const result = listHelper.mostBlogs(blogs)

  assert.deepStrictEqual(result, {
    author: 'A',
    blogs: 2,
  })
})

test('most likes returns correct author', () => {
  const blogs = [
    { author: 'A', title: '1', likes: 5 },
    { author: 'B', title: '2', likes: 10 },
    { author: 'A', title: '3', likes: 7 },
  ]

  const result = listHelper.mostLikes(blogs)

  assert.deepStrictEqual(result, {
    author: 'A',
    likes: 12,
  })
})
