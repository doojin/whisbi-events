import { Request, Response, NextFunction } from 'express'
import cantSubscribeTwice from './cantSubscribeTwice'
import { getSubscriptionRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('cant subscribe twice rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      user: {},
      params: {}
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      alreadySubscribed: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  describe('current user is already subscribed to the given event', () => {
    beforeEach(() => {
      subscriptionRepository.alreadySubscribed.mockResolvedValue(true)
    })

    test('sends an error', async () => {
      await cantSubscribeTwice(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'User is already subscribed to the given event' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('current user not subscribed to the given event', () => {
    beforeEach(() => {
      subscriptionRepository.alreadySubscribed.mockResolvedValue(false)
    })

    test('not sends any error', async () => {
      await cantSubscribeTwice(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
