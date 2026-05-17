const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
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

  const login = async (page, username, password) => {
    await page.goto('/login')  // go to the login page
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').nth(1).fill(password)
    await page.getByRole('button', { name: /login/i }).click()
  }

  const createBlog = async (page, title, author, url) => {
    await page.goto('/create')  // go directly to create page via URL
    await page.locator('input[name="title"]').fill(title)
    await page.locator('input[name="author"]').fill(author)
    await page.locator('input[name="url"]').fill(url)
    await page.getByRole('button', { name: /create/i }).click()
    // after creating, app redirects to / — wait for the blog to appear
    await expect(
      page.locator('div.blogItem').filter({ hasText: title })
    ).toBeVisible()
  }

  test('login succeeds with correct credentials', async ({ page }) => {
    await login(page, 'testuser3', 'password123')
    // after login, user name should appear in the navbar
    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await login(page, 'testuser3', 'wrongpassword')
    // error notification should appear
    await expect(page.getByText('wrong username or password')).toBeVisible()
    // user should NOT be logged in
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await login(page, 'testuser3', 'password123')
    await createBlog(page, 'My New Blog', 'Test Author', 'http://test.com')
    // blog should appear in the list
    await expect(
      page.locator('div.blogItem').filter({ hasText: 'My New Blog' })
    ).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await login(page, 'testuser3', 'password123')
    await createBlog(page, 'Blog to Like', 'Test Author', 'http://test.com')

    await page.locator('div.blogItem').filter({ hasText: 'Blog to Like' })
      .getByRole('link').click()

    await expect(page.getByTestId('likes')).toHaveText('0')

    await page.getByRole('button', { name: /like/i }).click()
    
    await expect(page.getByTestId('likes')).toHaveText('1')
  })

  test('a logged-in user can delete their own blog', async ({ page }) => {
    await login(page, 'testuser3', 'password123')
    await createBlog(page, 'Blog to Delete', 'Test Author', 'http://test.com')

    await page.locator('div.blogItem').filter({ hasText: 'Blog to Delete' })
      .getByRole('link').click()

    page.on('dialog', dialog => dialog.accept())

    await page.getByRole('button', { name: /remove/i }).click()

    await page.waitForURL('/')
    await expect(
      page.locator('div.blogItem').filter({ hasText: 'Blog to Delete' })
    ).not.toBeVisible()
  })

})
