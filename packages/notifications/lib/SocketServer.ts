import http from 'http'
import websocket from 'websocket'
import connectionRegistrator from './connectionRegistrator'

export default class SocketServer {
  private readonly httpServer: http.Server
  private readonly wsServer: websocket.server

  constructor () {
    this.httpServer = http.createServer()

    this.wsServer = new websocket.server({
      httpServer: this.httpServer
    })
  }

  public start (port: number): void {
    this.httpServer.listen(port)

    this.wsServer.on('request', (request: websocket.request) => {
      connectionRegistrator.register(request)
    })
  }
}
