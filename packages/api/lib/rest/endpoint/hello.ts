import { Handler, Request, Response } from 'express'

const helloHandler: Handler = (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' })
}

export default helloHandler
