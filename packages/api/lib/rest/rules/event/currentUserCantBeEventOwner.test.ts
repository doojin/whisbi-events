import { Request, Response, NextFunction } from 'express'
import currentUserCantBeEventOwner from './currentUserCantBeEventOwner'
import { User } from '@whisbi-events/persistence'

describe('current user cant be event owner rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {
      user: {}
    } as Request

    res = {
      locals: {
        event: {
          user: {}
        }
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  describe('current user is event owner', () => {
    beforeEach(() => {
      (req.user as User).id = 13
      res.locals.event.user.id = 13
    })

    test('sends an error', async () => {
      await currentUserCantBeEventOwner(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        error: 'This operation is forbidden for given event owner'
      })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('current user is not event owner', () => {
    beforeEach(() => {
      (req.user as User).id = 13
      res.locals.event.user.id = 14
    })

    test('not sends any error', async () => {
      await currentUserCantBeEventOwner(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
