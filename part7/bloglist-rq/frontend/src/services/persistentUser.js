const USER_KEY = 'loggedBlogAppUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(USER_KEY)
  return userJSON ? JSON.parse(userJSON) : null
}

const saveUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(USER_KEY)
}

export default {
  getUser,
  saveUser,
  removeUser,
}
