import { Request, Response, Handler, NextFunction } from 'express'

const authenticated: Handler = (req: Request, res: Response, next: NextFunction) => {
  if (req.user === undefined) {
    res.status(401).json({
      error: 'This resource is available only for authenticated users'
    })
    return
  }

  next()
}

export default authenticated
