import { Request, Response, NextFunction, Handler } from 'express'
import { User, getSubscriptionRepository } from '@whisbi-events/persistence'
import asyncHandler from '../../../error/asyncHandler'

export default (limit: number): Handler => {
  const limitSubscriptions: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User

    if (await getSubscriptionRepository().getUserSubscriptionCount(user.id) >= limit) {
      res.status(400).json({ error: `User cannot have more than ${limit} subscriptions` })
      return
    }

    next()
  }

  return asyncHandler(limitSubscriptions)
}
