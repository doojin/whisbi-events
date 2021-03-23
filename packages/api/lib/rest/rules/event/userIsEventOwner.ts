import { Handler, Request, Response, NextFunction } from 'express'
import { User, Event } from '@whisbi-events/persistence'
import asyncHandler from '../../error/asyncHandler'

const userIsEventOwner: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const event: Event = res.locals.event
  const currentUser = req.user as User

  if (currentUser === undefined || currentUser.id !== event.user.id) {
    res.status(403).json({ error: 'This operation is accessible only by event owner' })
    return
  }

  next()
}

export default asyncHandler(userIsEventOwner)
