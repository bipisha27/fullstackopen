const {test, expect, beforeEach, describe} = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser3',
        password: 'password123'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
})

  describe('Login', () => {
    test('succeeds with correct credentials', async({page}) => {
        await page.getByRole('textbox').first().fill('testuser3')
        await page.getByRole('textbox').nth(1).fill('password123')
        await page.getByRole('button', {name: /login/i}).click()
        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await page.getByRole('textbox').first().fill('testuser3')
      await page.getByRole('textbox').nth(1).fill('wrongpass')
      await page.getByRole('button', {name: /login/i}).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async({page}) => {
      await page.getByRole('textbox').first().fill('testuser3')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', {name: /login/i}).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async({page}) => {
      await page.getByRole('button', {name: /create new blog/i}).click()

     await page.locator('input[name="title"]').fill('test blog title')
      await page.locator('input[name="author"]').fill('test author')
      await page.locator('input[name="url"]').fill('http://testblog.com')

      await page.getByRole('button', {name: /create/i}).click()

      await expect(page.locator('div.blogItem').filter({hasText: 'test blog title'})).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: /create new blog/i }).click()
        await page.locator('input[name="title"]').fill('blog to be liked')
        await page.locator('input[name="author"]').fill('test author')
        await page.locator('input[name="url"]').fill('http://testblog.com')
        await page.getByRole('button', { name: /create/i }).click()

        const blogItem = page.locator('div.blogItem').filter({ hasText: 'blog to be liked' })
        await expect(blogItem).toBeVisible()

        await blogItem.getByRole('button', { name: 'view' }).click()
        await expect(blogItem.getByText('likes: 0')).toBeVisible()
        await blogItem.getByRole('button', { name: 'like' }).click()
        await expect(blogItem.getByText('likes: 1')).toBeVisible()
    })

    test('the user who added the blog can delete it', async({page}) => {
      await page.getByRole('button', {name: /create new blog/i}).click()
      await page.locator('input[name="title"]').fill('blog to be deleted')
      await page.locator('input[name="author"]').fill('test author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blogItem = page.locator('div.blogItem').filter({hasText: 'blog to be deleted'})
      await expect(blogItem).toBeVisible()

       page.on('dialog', dialog => dialog.accept()) //listens for window.confirm and automatically clicks OK. without this, playwright deletes dialog by default

      await blogItem.getByRole('button', {name: /view/i}).click()
      await blogItem.getByRole('button', {name: /remove/i}).click()
      await expect(blogItem).not.toBeVisible()
     })

    test('only the user who added the blog can see the delete button', async({page, request}) => {
      await page.getByRole('button', {name: /create new blog/i}).click()
      await page.locator('input[name="title"]').fill('blog with delete button')
      await page.locator('input[name="author"]').fill('test author')
      await page.locator('input[name="url"]').fill('http://testblog.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blogItem = page.locator('div.blogItem').filter({hasText: 'blog with delete button'})
      await expect(blogItem).toBeVisible()

      await blogItem.getByRole('button', {name: /view/i}).click()

      await expect(blogItem.getByRole('button', {name: /remove/i})).toBeVisible()

      await page.getByRole('button', {name: 'logout'}).click()

      await request.post('/api/users', {
        data: {
          name: 'another user',
          username: 'anotheruser',
          password: 'password123'
        }
      })
        await page.getByRole('textbox').first().fill('anotheruser')
        await page.getByRole('textbox').nth(1).fill('password123')
        await page.getByRole('button', { name: /login/i }).click()
        await expect(page.getByText('another user logged in')).toBeVisible()

        await blogItem.getByRole('button', {name: /view/i}).click()

        await expect(blogItem.getByRole('button', {name: /remove/i})).not.toBeVisible()
    })

    describe('blog ordering', () => {
    test('blogs are arranged by likes, most liked first', async ({page}) => {
      await page.getByRole('button', {name: /create new blog/i}).click()
      await page.locator('input[name="title"]').fill('least liked blog')
      await page.locator('input[name="author"]').fill('author')
      await page.locator('input[name="url"]').fill('http://test.com')
      await page.getByRole('button', { name: /create/i }).click()
      await expect(page.locator('div.blogItem').filter({ hasText: 'least liked blog' })).toBeVisible()

    await page.getByRole('button', { name: /create new blog/i }).click()
    await page.locator('input[name="title"]').fill('most liked blog')
    await page.locator('input[name="author"]').fill('author')
    await page.locator('input[name="url"]').fill('http://test.com')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('div.blogItem').filter({ hasText: 'most liked blog' })).toBeVisible()

    await page.getByRole('button', { name: /create new blog/i }).click()
    await page.locator('input[name="title"]').fill('middle liked blog')
    await page.locator('input[name="author"]').fill('author')
    await page.locator('input[name="url"]').fill('http://test.com')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.locator('div.blogItem').filter({ hasText: 'middle liked blog' })).toBeVisible()

    const mostLiked = page.locator('div.blogItem').filter({hasText: 'most liked blog'})
    await mostLiked.getByRole('button', {name: /view/i}).click()
    await mostLiked.getByRole('button', {name: /like/i}).click()
    await expect(mostLiked.getByText('likes: 1')).toBeVisible()
    await mostLiked.getByRole('button', { name: /like/i }).click()
    await expect(mostLiked.getByText('likes: 2')).toBeVisible()
    await mostLiked.getByRole('button', { name: /like/i }).click()
    await expect(mostLiked.getByText('likes: 3')).toBeVisible()

    const middleLiked = page.locator('div.blogItem').filter({hasText: 'middle liked blog'})
    await middleLiked.getByRole('button', {name: /view/i}).click()
    await middleLiked.getByRole('button', {name: /like/i}).click()
    await expect(middleLiked.getByText('likes: 1')).toBeVisible()
    await middleLiked.getByRole('button', {name: /like/i}).click()
    await expect(middleLiked.getByText('likes: 2')).toBeVisible()

    const blogs = page.locator('div.blogItem')
    const firstBlog = await blogs.nth(0).textContent()
    const secondBlog = await blogs.nth(1).textContent()
    const thirdBlog = await blogs.nth(2).textContent()

    expect(firstBlog).toContain('most liked blog')
    expect(secondBlog).toContain('middle liked blog')
    expect(thirdBlog).toContain('least liked blog')
      })
    })
  })
})