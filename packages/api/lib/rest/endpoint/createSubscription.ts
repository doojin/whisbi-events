import { Handler, Request, Response } from 'express'
import { Subscription, Event, getSubscriptionRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const createSubscription: Handler = async (req: Request, res: Response): Promise<void> => {
  const subscriptionData: Partial<Subscription> = req.body
  const event: Event = res.locals.event

  const subscriptionRepository = getSubscriptionRepository()

  const { raw: { insertId: subscriptionId } } = await subscriptionRepository.insert({
    ...subscriptionData,
    event,
    id: undefined
  })

  const subscription = await subscriptionRepository.findOne(subscriptionId)

  res.status(201).json(subscription)
}

export default asyncHandler(createSubscription)
