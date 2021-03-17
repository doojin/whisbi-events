import express from 'express'
import helloHandler from './endpoint/hello'

export default {
  start (port: number) {
    const router = express.Router()
    router.get('/hello', helloHandler)

    const app = express()
    app.use('/api/v1', router)

    return app.listen(port, () => {
      console.log(`REST service started on port: ${port}`)
    })
  }
}
