const { test, describe, expect } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
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

  test('front page can be opened', async ({ page }) => {
    await expect(page.getByText('Notes')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'testuser', 'testpass')
    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'testuser', 'wrong')
    await expect(page.getByText('wrong credentials')).toBeVisible()
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpass')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible({ timeout: 5000 })
    })

    describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'hello unique note')
      })

      test('importance can be changed', async ({ page }) => {
        const noteItem = page.locator('li.note').last()
        const toggleBtn = noteItem.getByRole('button', { name: /make not important/i })
        await expect(toggleBtn).toBeVisible()
        await toggleBtn.click()
        await expect(noteItem.getByRole('button', { name: /make important/i })).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..') //... means go up to the parent element. if othernotetext is span then it goes to list that contains it
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})