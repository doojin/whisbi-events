import { Handler, Request, Response, NextFunction } from 'express'

export default function asyncHandler (endpoint: Handler): Handler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await endpoint(req, res, next)
    } catch (e) {
      const statusCode = e.statusCode !== undefined ? e.statusCode : 500
      res.status(statusCode).json({ error: e.message })
    }
  }
}
