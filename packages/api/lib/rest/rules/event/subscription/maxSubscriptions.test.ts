import { Request, Response, NextFunction } from 'express'
import maxSubscriptions from './maxSubscriptions'
import { getSubscriptionRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('max subscriptions rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      user: {}
    } as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      getUserSubscriptionCount: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  describe('user exceeds allowed amount of subscriptions', () => {
    beforeEach(() => {
      subscriptionRepository.getUserSubscriptionCount.mockReturnValue(5)
    })

    test('sends an error', async () => {
      await maxSubscriptions(5)(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'User cannot have more than 5 subscriptions' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('user not exceeds allowed amount of subscriptions', () => {
    beforeEach(() => {
      subscriptionRepository.getUserSubscriptionCount.mockReturnValue(4)
    })

    test('not sends any error', async () => {
      await maxSubscriptions(5)(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
