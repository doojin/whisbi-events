import { Request, Response, NextFunction } from 'express'
import onePublishedEventPerUser from './onePublishedEventPerUser'
import { getEventRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('one published event rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      hasNonDraftUserEvents: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)

    req = { user: {} } as any as Request

    res = {
      status: jest.fn().mockReturnThis() as Function,
      json: jest.fn() as Function
    } as Response

    next = jest.fn()
  })

  describe('user has published event', () => {
    beforeEach(() => {
      eventRepository.hasNonDraftUserEvents.mockResolvedValue(true)
    })

    describe('user tries to create draft event', () => {
      beforeEach(() => {
        req.body = {
          state: 'draft'
        }
      })

      test('not sends error message', async () => {
        await onePublishedEventPerUser(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    describe('user tries to create non-draft event', () => {
      beforeEach(() => {
        req.body = {
          state: 'public'
        }
      })

      test('sends error message', async () => {
        await onePublishedEventPerUser(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: 'User can have only one published event at a time' })
        expect(next).not.toHaveBeenCalled()
      })
    })
  })

  describe('user has no published events', () => {
    beforeEach(() => {
      eventRepository.hasNonDraftUserEvents.mockResolvedValue(false)
    })

    describe('user tries to create draft event', () => {
      beforeEach(() => {
        req.body = {
          state: 'draft'
        }
      })

      test('not sends error message', async () => {
        await onePublishedEventPerUser(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    describe('user tries to create non-draft event', () => {
      beforeEach(() => {
        req.body = {
          state: 'public'
        }
      })

      test('not sends error message', async () => {
        await onePublishedEventPerUser(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })
  })
})
