import { Request, Response, NextFunction, Handler } from 'express'
import { getSubscriptionRepository, User } from '@whisbi-events/persistence'
import asyncHandler from '../../../error/asyncHandler'

const cantSubscribeTwice: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const eventId = req.params.eventId

  const subscribed = await getSubscriptionRepository().alreadySubscribed(user.id, eventId)

  if (subscribed) {
    res.status(400).json({ error: 'User is already subscribed to the given event' })
    return
  }

  next()
}

export default asyncHandler(cantSubscribeTwice)
