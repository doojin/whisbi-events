import { store } from 'react-notifications-component'

function sendNotification (title, message, type) {
  store.addNotification({
    title,
    message,
    type,
    container: 'top-center',
    animationIn: ['animate__animated animate__fadeIn'],
    animationOut: ['animate__animated animate__fadeOut'],
    dismiss: {
      duration: 2500,
      onScreen: true
    }
  })
}

export default {
  success (message) {
    sendNotification('Success!', message, 'success')
  },

  error (message) {
    sendNotification('Error!', message, 'danger')
  }
}
