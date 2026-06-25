import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const notificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContextProvider value={[notification, dispatch]}>
      {props.children}
    </NotificationContextProvider>
  )
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext)
  return dispatch
}

export default NotificationContext
