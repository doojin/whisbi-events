import { Request, Response, NextFunction } from 'express'
import authenticated from './authenticated'

describe('authenticated rule', () => {
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

  describe('request contains user', () => {
    beforeEach(() => {
      req.user = { name: 'definitely not undefined user' }
    })

    test('not sets any status code on response', () => {
      authenticated(req, res, next)
      expect(res.status).not.toHaveBeenCalled()
    })

    test('not sends any response body', () => {
      authenticated(req, res, next)
      expect(res.json).not.toHaveBeenCalled()
    })

    test('continues middleware chain', () => {
      authenticated(req, res, next)
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('request not contains user', () => {
    test('sets unauthorized status code', () => {
      authenticated(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(401)
    })

    test('sends error message', () => {
      authenticated(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'This resource is available only for authenticated users' })
    })

    test('aborts middleware chain', () => {
      authenticated(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })
})
