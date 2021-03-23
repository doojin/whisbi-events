import { Request, Response, NextFunction } from 'express'
import onePublishedEventPerUser from './onePublishedEventPerUser'
import { EventState, getEventRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('one published event rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      getExistingUserNonDraftEventId: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)

    req = {
      user: {},
      params: {
        eventId: '13'
      }
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis() as Function,
      json: jest.fn() as Function
    } as Response

    next = jest.fn()
  })

  describe('creating/updating event is draft', () => {
    beforeEach(() => {
      req.body = {
        state: EventState.DRAFT
      }
    })

    test('not sends any error', async () => {
      await onePublishedEventPerUser(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('creating/updating event is not draft', () => {
    beforeEach(() => {
      req.body = {
        state: EventState.PRIVATE
      }
    })

    describe('user has no existing events', () => {
      beforeEach(() => {
        eventRepository.getExistingUserNonDraftEventId.mockResolvedValue(undefined)
      })

      test('not sends any error', async () => {
        await onePublishedEventPerUser(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    describe('user has existing non-draft event', () => {
      describe('existing non-draft event is the one that user tries to update', () => {
        beforeEach(() => {
          eventRepository.getExistingUserNonDraftEventId.mockResolvedValue(13)
        })

        test('not sends any error', async () => {
          await onePublishedEventPerUser(req, res, next)

          expect(res.status).not.toHaveBeenCalled()
          expect(res.json).not.toHaveBeenCalled()
          expect(next).toHaveBeenCalledTimes(1)
        })
      })

      describe('existing non-draft event differs from the one that user tries to update', () => {
        beforeEach(() => {
          eventRepository.getExistingUserNonDraftEventId.mockResolvedValue(14)
        })

        test('sends an error', async () => {
          await onePublishedEventPerUser(req, res, next)

          expect(res.status).toHaveBeenCalledWith(400)
          expect(res.json).toHaveBeenCalledWith({ message: 'User can have only one published event at a time' })
          expect(next).not.toHaveBeenCalled()
        })
      })
    })
  })
})
