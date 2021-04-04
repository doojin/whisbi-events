import websocket from 'websocket'
import connectionManager from './connectionManager'
import { getUserRepository } from '@whisbi-events/persistence'

export default {
  register (request: websocket.request) {
    const connection: websocket.connection = request.accept('echo-protocol')

    connection.on('message', async (message: websocket.IMessage) => {
      const userToken = message.utf8Data as string
      const user = await getUserRepository().findByTokenValue(userToken)

      if (user !== undefined) {
        connectionManager.addConnection(user.id, connection)
        connection.on('close', () => connectionManager.removeConnection(user.id))
      }
    })
  }
}
