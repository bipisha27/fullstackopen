const { test, describe, expect } = require('@playwright/test')

describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Notes')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click()
    await page.getByLabel('username').fill('testuser')
    await page.getByLabel('password').fill('testpass')
    await page.getByRole('button', { name: /login/i }).click()

    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: /login/i }).click()
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('testpass')
      await page.getByRole('button', { name: /login/i }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: /new note/i }).click()
      await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByRole('button', { name: /save/i }).click()

      await expect(
        page.getByText('Your awesome note: a note created by playwright').first()
      ).toBeVisible({ timeout: 5000 })
    })

    describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: /new note/i }).click()
        await page.getByRole('textbox').fill('hello unique note')
        await page.getByRole('button', { name: /save/i }).click()

        await expect(page.getByText('hello unique note').last()).toBeVisible({ timeout: 5000 })
      })

    test('importance can be changed', async ({ page }) => {
      const noteItem = page.locator('li.note').last()
      const toggleBtn = noteItem.getByRole('button', { name: /make not important/i })

      await expect(toggleBtn).toBeVisible()
    
      await expect(async () => {
        await toggleBtn.click()
        await expect(noteItem.getByRole('button', { name: /make important/i })).toBeVisible({ timeout: 1000 })
      }).toPass({ timeout: 5000 })
    })
    })
  })
})