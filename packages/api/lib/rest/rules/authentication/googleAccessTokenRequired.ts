import { Request, Response, Handler, NextFunction } from 'express'
import asyncHandler from '../../error/asyncHandler'

const googleAccessTokenRequired: Handler = (req: Request, res: Response, next: NextFunction) => {
  const googleAccessToken = req.body.googleToken

  if (googleAccessToken === undefined) {
    res.status(403).json({ error: 'Google access token is required for this operation' })
    return
  }

  next()
}

export default asyncHandler(googleAccessTokenRequired)
