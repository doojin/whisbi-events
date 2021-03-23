import { Request, Response, NextFunction } from 'express'
import { EventState } from '@whisbi-events/persistence'
import privateEventVisibleOnlyByAuthenticated from './privateEventVisibleOnlyByAuthenticated'

describe('private event visible only by authenticated users rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  describe('event is private', () => {
    beforeEach(() => {
      res.locals = {
        event: {
          state: EventState.PRIVATE
        }
      }
    })

    describe('user is authenticated', () => {
      beforeEach(() => {
        req.user = {}
      })

      test('not sends any error', async () => {
        await privateEventVisibleOnlyByAuthenticated(req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
      })
    })

    describe('user is anonymous', () => {
      test('sends an error', async () => {
        await privateEventVisibleOnlyByAuthenticated(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ error: 'Private event can be only accessed by authenticated users' })
        expect(next).not.toHaveBeenCalled()
      })
    })
  })

  describe('event is public', () => {
    beforeEach(() => {
      res.locals = {
        event: {
          state: EventState.PUBLIC
        }
      }
    })

    test('not sends any error', async () => {
      await privateEventVisibleOnlyByAuthenticated(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
