import { Subscription } from '@whisbi-events/persistence'
import SubscriptionEmitter from './SubscriptionEmitter'
import SocketServer from './SocketServer'
import connectionManager from './connectionManager'

export default {
  start (port: number) {
    const socketServer = new SocketServer()
    socketServer.start(port)

    // Event emitter which "automagically" emits subscriptions for events starting in 24h
    const subscriptionEmitter = new SubscriptionEmitter()

    // So once we receive subscription to send notification about ->
    // We check if there is an open connection present from corresponding subscriber.
    // If so, we get this connection and send a notification
    subscriptionEmitter.on('subscription', (subscription: Subscription) => {
      const userId = subscription.user.id

      if (connectionManager.hasConnection(userId)) {
        connectionManager
          .getConnection(userId)
          .sendUTF(`Reminder! Event: "${subscription.event.headline}" starts in 24 hours`)
      }
    })
  }
}
