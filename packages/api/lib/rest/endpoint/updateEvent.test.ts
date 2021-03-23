import { Request, Response, NextFunction } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import updateEvent from './updateEvent'

jest.mock('@whisbi-events/persistence')

describe('update event endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let eventRepository

  beforeEach(() => {
    req = {
      params: {
        eventId: '13'
      },
      body: {
        headline: 'test-headline'
      }
    } as any as Request

    res = {
      json: jest.fn()
    } as any as Response

    eventRepository = {
      update: jest.fn(),
      findOne: jest.fn().mockResolvedValue({ headline: 'test-headline' })
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  test('updates existing event', async () => {
    await updateEvent(req, res, next)

    expect(eventRepository.update).toHaveBeenCalledWith('13', { headline: 'test-headline' })
    expect(res.json).toHaveBeenCalledWith({ headline: 'test-headline' })
  })
})
