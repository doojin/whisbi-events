import { Handler, Request, Response, NextFunction } from 'express'
import { User, Subscription } from '@whisbi-events/persistence'
import asyncHandler from '../../../error/asyncHandler'

const userIsSubscriptionOwner: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const subscription: Subscription = res.locals.subscription
  const currentUser = req.user as User

  if (currentUser === undefined || currentUser.id !== subscription.user.id) {
    res.status(403).json({ error: 'This operation is accessible only by subscription owner' })
    return
  }

  next()
}

export default asyncHandler(userIsSubscriptionOwner)
