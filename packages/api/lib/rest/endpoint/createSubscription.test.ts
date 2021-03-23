import { Request, Response, NextFunction } from 'express'
import createSubscription from './createSubscription'
import { getSubscriptionRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('create subscription endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let subscriptionRepository

  beforeEach(() => {
    req = {
      user: {},
      body: {
        id: 13,
        name: 'test-name',
        email: 'test-email'
      }
    } as Request

    res = {
      locals: {
        event: {
          id: 14
        }
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    subscriptionRepository = {
      insert: jest.fn().mockImplementation(() => ({
        raw: { insertId: 15 }
      })),
      findOne: jest.fn()
    };

    (getSubscriptionRepository as jest.Mock).mockReturnValue(subscriptionRepository)
  })

  test('creates subscription entity', async () => {
    await createSubscription(req, res, next)

    expect(subscriptionRepository.insert).toHaveBeenCalledWith({
      id: undefined,
      name: 'test-name',
      email: 'test-email',
      event: {
        id: 14
      },
      user: {}
    })
  })

  test('returns subscription entity', async () => {
    subscriptionRepository.findOne.mockResolvedValue({
      name: 'test-name'
    })

    await createSubscription(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ name: 'test-name' })
  })
})
