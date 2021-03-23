import { Handler, Request, Response, NextFunction } from 'express'

export default function asyncHandler (endpoint: Handler): Handler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await endpoint(req, res, next)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}
