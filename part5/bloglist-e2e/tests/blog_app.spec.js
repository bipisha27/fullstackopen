const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })
    await page.goto('/')
  })

  const login = async (page, username, password, name) => {
    await page.goto('/login')
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').nth(1).fill(password)
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page.getByText(`${name} logged in`)).toBeVisible()
  }

  const createBlog = async (page, title, author, url) => {
    await page.getByRole('link', { name: /create new blog/i }).click()
    await page.locator('input[name="title"]').fill(title)
    await page.locator('input[name="author"]').fill(author)
    await page.locator('input[name="url"]').fill(url)
    await page.getByRole('button', { name: /create/i }).click()
    await expect(
      page.locator('div.blogItem').filter({ hasText: title })
    ).toBeVisible()
  }

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').nth(1).fill('testpass')
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').nth(1).fill('wrongpassword')
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page.getByText('wrong username or password')).toBeVisible()
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })

  test('a logged-in user can create a blog', async ({ page }) => {
    await login(page, 'testuser', 'testpass', 'Test User')
    await createBlog(page, 'My New Blog', 'Test Author', 'http://test.com')
    await expect(
      page.locator('div.blogItem').filter({ hasText: 'My New Blog' })
    ).toBeVisible()
  })

  test('a logged-in user can like a blog', async ({ page }) => {
    await login(page, 'testuser', 'testpass', 'Test User')
    await createBlog(page, 'Blog to Like', 'Test Author', 'http://test.com')
    await page.locator('div.blogItem').filter({ hasText: 'Blog to Like' })
      .getByRole('link').click()
    await expect(page.getByTestId('likes')).toHaveText('0')
    await page.getByRole('button', { name: /like/i }).click()
    await expect(page.getByTestId('likes')).toHaveText('1')
  })

  test('a logged-in user can delete their own blog', async ({ page }) => {
    await login(page, 'testuser', 'testpass', 'Test User')
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
