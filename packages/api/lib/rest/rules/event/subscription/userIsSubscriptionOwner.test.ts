import { Request, Response, NextFunction } from 'express'
import userIsSubscriptionOwner from './userIsSubscriptionOwner'
import { getSubscriptionRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('user is subscription owner rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      params: {}
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {
        subscription: {
          user: {
            id: 13
          }
        }
      }
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      alreadySubscribed: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  describe('user is anonymous', () => {
    beforeEach(() => {
      req.user = undefined
    })

    test('sends an error', async () => {
      await userIsSubscriptionOwner(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'This operation is accessible only by subscription owner' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('user is subscription owner', () => {
    beforeEach(() => {
      req.user = { id: 13 }
    })

    test('not sends any error', async () => {
      await userIsSubscriptionOwner(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('user is not subscription owner', () => {
    beforeEach(() => {
      req.user = { id: 14 }
    })

    test('sends an error', async () => {
      await userIsSubscriptionOwner(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'This operation is accessible only by subscription owner' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
