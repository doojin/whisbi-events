import { Request, Response, NextFunction } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import existingEvent from './existingEvent'

jest.mock('@whisbi-events/persistence')

describe('event with given id should exist rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      findOneAndJoinWithUser: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)

    req = {
      params: {
        eventId: '13'
      }
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis() as Function,
      json: jest.fn() as Function,
      locals: {}
    } as Response

    next = jest.fn()
  })

  describe('event with given id exists', () => {
    beforeEach(() => {
      eventRepository.findOneAndJoinWithUser.mockResolvedValue({ id: 13 })
    })

    test('not sends any error', async () => {
      await existingEvent(req, res, next)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(res.locals.event).toEqual({ id: 13 })
    })
  })

  describe('event with given id not exists', () => {
    beforeEach(() => {
      eventRepository.findOneAndJoinWithUser.mockResolvedValue(undefined)
    })

    test('sends an error', async () => {
      await existingEvent(req, res, next)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event with given id does not exist' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
