import { w3cwebsocket as W3CWebSocket } from 'websocket'
import notifications from '../notifications'

const SERVICE_URL = `ws://${window.location.hostname}:8001/`

export default {
  client: null,
  closed: false,
  retries: 0,

  createConnection (userToken) {
    this.retries++
    this.closed = false
    this.client = new W3CWebSocket(SERVICE_URL, 'echo-protocol')

    this.client.onopen = () => {
      this.retries = 0
      this.client.send(userToken)
      notifications.info('You\'ve been connected to notification service')
    }

    this.client.onmessage = message => notifications.info(message.data)

    this.client.onclose = () => {
      if (this.retries === 3) {
        notifications.error('Tried to connect to notification service 3 times. Aborting')
      }

      if (!this.closed && this.retries < 3) {
        setTimeout(() => this.createConnection(userToken), 3 * 1000)
      }
    }
  },

  disconnect () {
    this.closed = true

    if (this.client !== null) {
      this.client.close()
    }
  }
}
