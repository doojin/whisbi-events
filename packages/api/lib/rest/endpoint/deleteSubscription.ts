import { Handler, Request, Response } from 'express'
import { getSubscriptionRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const deleteSubscription: Handler = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.subscriptionId

  await getSubscriptionRepository().delete(id)

  res.status(204).end()
}

export default asyncHandler(deleteSubscription)
