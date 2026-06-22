import { createContext, useState, useContext } from "react";

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const[notification, setNotification] = useState('')

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return(
    <NotificationContext.Provider value={{notification, notify}}>
      {props.children}
    </NotificationContext.Provider>
  )
}


export default NotificationContext