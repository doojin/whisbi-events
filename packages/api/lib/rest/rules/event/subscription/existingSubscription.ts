import { Request, Response, NextFunction, Handler } from 'express'
import { getSubscriptionRepository } from '@whisbi-events/persistence'
import asyncHandler from '../../../error/asyncHandler'

const existingSubscription: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.subscriptionId

  const subscription = await getSubscriptionRepository().findOneAndJoinWithUser(id)

  if (subscription === undefined) {
    res.status(404).json({ error: 'Subscription with given id does not exist' })
    return
  }

  // To avoid querying database multiple times in the next middleware, lets assign subscription to res.locals
  // From express docs:
  // This property is useful for exposing request-level information such as the request path name, authenticated user,
  // user settings, and so on.
  res.locals.subscription = subscription

  next()
}

export default asyncHandler(existingSubscription)
