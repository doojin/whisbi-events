import { Request, Response, NextFunction } from 'express'
import { getSubscriptionRepository } from '@whisbi-events/persistence'
import getUserSubscriptions from './getUserSubscriptions'

jest.mock('@whisbi-events/persistence')

describe('get user subscriptions endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      user: { id: 13 }
    } as any as Request

    res = {
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      getUserSubscriptions: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  test('returns current user subscriptions', async () => {
    subscriptionRepository.getUserSubscriptions.mockResolvedValue([{ id: 1 }])

    await getUserSubscriptions(req, res, next)

    expect(subscriptionRepository.getUserSubscriptions).toHaveBeenCalledWith(13)
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }])
  })
})
