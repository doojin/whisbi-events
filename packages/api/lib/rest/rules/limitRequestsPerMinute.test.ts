import { Request, Response, NextFunction } from 'express'
import limitRequestsPerMinute from './limitRequestsPerMinute'

jest.useFakeTimers()

describe('limit requests per minute rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {
      socket: {
        remoteAddress: '127.0.0.1'
      },
      header: jest.fn().mockReturnValue('test-token')
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  test('limits requests by user ip', async () => {
    const limitRequests = limitRequestsPerMinute({ perIpAddress: 1, perUserToken: 10 })

    // First request should be ok
    await limitRequests(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)

    // Exceeding limit
    await limitRequests(req, res, next)

    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith({ error: 'Requests amount per minute from given IP address is exceeded' })
  })

  test('limits requests by user', async () => {
    const limitRequests = limitRequestsPerMinute({ perIpAddress: 10, perUserToken: 1 })

    // First request should be ok
    await limitRequests(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)

    // Exceeding limit
    await limitRequests(req, res, next)

    expect(res.status).toHaveBeenCalledWith(429)
    expect(res.json).toHaveBeenCalledWith({ error: 'Requests amount per minute for given user is exceeded' })
  })
})
