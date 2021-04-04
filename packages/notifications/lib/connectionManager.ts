import websocket from 'websocket'

export default {
  connections: {} as { [key: number]: websocket.connection },

  addConnection (userId: number, connection: websocket.connection): void {
    this.connections[userId] = connection
  },

  removeConnection (userId: number) {
    delete this.connections[userId]
  },

  hasConnection (userId: number) {
    return this.connections[userId] !== undefined
  },

  getConnection (userId: number): websocket.connection {
    return this.connections[userId]
  }
}
