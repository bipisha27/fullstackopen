import {create} from 'zustand'

const useNotificationStore = create((set) => ({
  message: '',

  setNotification: (message) => {
    set({message})

    setTimeout(() => {
      set({message: ''})
    }, 5000)
  }
}))

export default useNotificationStore