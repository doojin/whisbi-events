import { Request, Response, NextFunction } from 'express'
import existingSubscription from './existingSubscription'
import { getSubscriptionRepository, Subscription } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('existing subscription rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      params: {
        subscriptionId: 13
      }
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      findOneAndJoinWithUser: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  describe('subscription exists', () => {
    let subscription: Subscription

    beforeEach(() => {
      subscription = { name: 'test-name' } as Subscription
      subscriptionRepository.findOneAndJoinWithUser.mockResolvedValue(subscription)
    })

    test('not sends any error', async () => {
      await existingSubscription(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })

    test('passes subscription to the next middleware', async () => {
      await existingSubscription(req, res, next)

      expect(res.locals.subscription).toEqual(subscription)
    })
  })

  describe('subscription not exists', () => {
    beforeEach(() => {
      subscriptionRepository.findOneAndJoinWithUser.mockResolvedValue(undefined)
    })

    test('sends an error', async () => {
      await existingSubscription(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Subscription with given id does not exist' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
