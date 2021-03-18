import { Handler, NextFunction, Request, Response } from 'express'
import asyncHandler from './asyncHandler'
import HttpError from './HttpError'

describe('asynchronous endpoint error handler', () => {
  let endpoint: Handler
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

  test('sends error message', async () => {
    endpoint = async () => {
      throw new Error('test error')
    }

    await asyncHandler(endpoint)(req, res, next)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'test error' })
  })

  describe('error contains status code', () => {
    beforeEach(() => {
      endpoint = async () => { throw new HttpError(405, 'test error') }
    })

    test('sends correct status code', async () => {
      await asyncHandler(endpoint)(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(405)
    })
  })

  describe('error not contains status code', () => {
    beforeEach(() => {
      endpoint = async () => { throw new Error('test error') }
    })

    test('sends "internal server error" status code', async () => {
      await asyncHandler(endpoint)(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })
})
