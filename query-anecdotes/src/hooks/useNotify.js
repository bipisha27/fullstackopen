import {useContext} from 'react'
import NotificationContext from '../NotificationContext'

const useNotify = () => {
  return useContext(NotificationContext)
}

export default useNotify