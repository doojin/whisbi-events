import { Request, Response, NextFunction } from 'express'
import draftEventVisibleOnlyByOwner from './draftEventVisibleOnlyByOwner'
import { EventState } from '@whisbi-events/persistence'

describe('draft event visible only by it\'s owner rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request

    res = {
      status: jest.fn().mockReturnThis() as Function,
      json: jest.fn() as Function
    } as Response

    next = jest.fn()
  })

  describe('event is draft', () => {
    beforeEach(() => {
      res.locals = {
        event: {
          state: EventState.DRAFT,
          user: {
            id: 13
          }
        }
      }
    })

    describe('user is event owner', () => {
      beforeEach(() => {
        req.user = {
          id: 13
        }
      })

      test('not sends any error', async () => {
        await draftEventVisibleOnlyByOwner(req, res, next)
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    describe('user is not event owner', () => {
      beforeEach(() => {
        req.user = {
          id: 14
        }
      })

      test('sends an error', async () => {
        await draftEventVisibleOnlyByOwner(req, res, next)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ message: 'Draft event can be only accessed by event owner' })
        expect(next).not.toHaveBeenCalled()
      })
    })
  })

  describe('event is not draft', () => {
    beforeEach(() => {
      res.locals = {
        event: {
          state: EventState.PUBLIC
        }
      }
    })

    test('not sends any error', async () => {
      await draftEventVisibleOnlyByOwner(req, res, next)
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
