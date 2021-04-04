import { Handler, Request, Response } from 'express'
import { getSubscriptionRepository, User } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const getUserSubscriptions: Handler = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as User

  const subscriptions = await getSubscriptionRepository().getUserSubscriptions(user.id)

  res.json(subscriptions)
}

export default asyncHandler(getUserSubscriptions)
