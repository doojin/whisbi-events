import { Request, Response, NextFunction, Handler } from 'express'
import { Event, User } from '@whisbi-events/persistence'
import asyncHandler from '../../error/asyncHandler'

const currentUserCantBeEventOwner: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const event: Event = res.locals.event
  const currentUser = req.user as User

  if (currentUser.id === event.user.id) {
    res.status(401).json({ error: 'This operation is forbidden for given event owner' })
    return
  }

  next()
}

export default asyncHandler(currentUserCantBeEventOwner)
