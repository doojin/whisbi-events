import { Request, Response, NextFunction } from 'express'
import googleAccessTokenRequired from './googleAccessTokenRequired'

describe('Google access token is required rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: {}
    } as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  describe('access token is sent', () => {
    beforeEach(() => {
      req.body.googleToken = 'test-token'
    })

    test('not sends any error', async () => {
      await googleAccessTokenRequired(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('access token is not sent', () => {
    beforeEach(() => {
      req.body.googleToken = undefined
    })

    test('sends an error', async () => {
      await googleAccessTokenRequired(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Google access token is required for this operation' })
      expect(next).not.toHaveBeenCalled()
    })
  })
})
