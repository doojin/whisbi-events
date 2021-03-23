import { Request, Response, NextFunction } from 'express'
import userIsEventOwner from './userIsEventOwner'

describe('current user must be event owner rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request

    res = {
      locals: {
        event: {
          id: 69,
          user: {
            id: 13
          }
        }
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  describe('current user is event owner', () => {
    beforeEach(() => {
      req.user = {
        id: 13
      }
    })

    test('not sends any error', async () => {
      await userIsEventOwner(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('current user is not event owner', () => {
    beforeEach(() => {
      req.user = {
        id: 14
      }
    })

    test('sends an error', async () => {
      await userIsEventOwner(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'This operation is accessible only by event owner' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('current user is anonymous', () => {
    beforeEach(() => {
      req.user = undefined
    })

    test('sends an error', async () => {
      await userIsEventOwner(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'This operation is accessible only by event owner' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
