import { Request, Response, NextFunction } from 'express'
import deleteSubscription from './deleteSubscription'
import { getSubscriptionRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('delete subscription endpoint', () => {
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
      end: jest.fn()
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      delete: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  test('deletes existing subscription', async () => {
    await deleteSubscription(req, res, next)

    expect(subscriptionRepository.delete).toHaveBeenCalledWith(13)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.end).toHaveBeenCalled()
  })
})
