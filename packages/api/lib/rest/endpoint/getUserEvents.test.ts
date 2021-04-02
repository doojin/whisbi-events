import { Request, Response, NextFunction } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import getUserEvents from './getUserEvents'

jest.mock('@whisbi-events/persistence')

describe('get user events endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let eventRepository

  beforeEach(() => {
    req = {
      user: { id: 13 }
    } as any as Request

    res = {
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    eventRepository = {
      findUserEvents: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  test('returns current user events', async () => {
    eventRepository.findUserEvents.mockResolvedValue([{ headline: 'test-event' }])

    await getUserEvents(req, res, next)

    expect(eventRepository.findUserEvents).toHaveBeenCalledWith(13)
    expect(res.json).toHaveBeenCalledWith([{ headline: 'test-event' }])
  })
})
