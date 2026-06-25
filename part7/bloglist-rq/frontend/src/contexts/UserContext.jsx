import { createContext, useState, useContext } from 'react'

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const [user] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const [, setUser] = useContext(UserContext)
  return setUser
}

export default UserContext
