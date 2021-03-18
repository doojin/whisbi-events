import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import createEvent from './endpoint/createEvent'
import authenticate from './authentication/index'
import authenticated from './rules/authenticated'

export default {
  start (port: number) {
    const router = express.Router()
    const app = express()

    app.use(bodyParser.json())
    app.use(passport.initialize())
    app.use(authenticate())

    app.use('/api/v1', router)
    router.post('/event', authenticated, createEvent)

    return app.listen(port, () => {
      console.log(`REST service started on port: ${port}`)
    })
  }
}
