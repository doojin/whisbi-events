import { Request, Response, Handler, NextFunction } from 'express'
import asyncHandler from '../error/asyncHandler'

interface RpmConfig {
  perIpAddress: number
  perUserToken: number
}

export default function limitRequestsPerMinute (config: RpmConfig): Handler {
  let requestsByIp = {}
  let requestsByToken = {}

  // Refreshing request "buckets" every minute
  setInterval(() => {
    requestsByIp = {}
    requestsByToken = {}
  }, 60 * 1000)

  const limitRequests: Handler = (req: Request, res: Response, next: NextFunction) => {
    const requestIp = req.socket.remoteAddress as string
    const token = req.header('token')

    // When request arrives for the first time we initialize corresponding entries in buckets

    if (requestsByIp[requestIp] === undefined) {
      requestsByIp[requestIp] = 0
    }

    if (token !== undefined && requestsByToken[token] === undefined) {
      requestsByToken[token] = 0
    }

    // If amount of requests per user ip or user token exceeds the limit we send an error

    if (requestsByIp[requestIp] >= config.perIpAddress) {
      res.status(429).json({ error: 'Requests amount per minute from given IP address is exceeded' })
      return
    }

    if (token !== undefined && requestsByToken[token] >= config.perUserToken) {
      res.status(429).json({ error: 'Requests amount per minute for given user is exceeded' })
      return
    }

    // If all good we increment our entries and successfully proceed to next middleware

    requestsByIp[requestIp]++

    if (token !== undefined) {
      requestsByToken[token]++
    }

    next()
  }

  return asyncHandler(limitRequests)
}
