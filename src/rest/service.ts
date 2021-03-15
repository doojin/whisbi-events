import express, { Router, Request, Response } from 'express'

export default {
  run (port: number) {
    const app = express()
    const router = Router()

    router.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Hello, world!' })
    })

    app.use('/api/v1', router)
    return app.listen(port)
  }
}
