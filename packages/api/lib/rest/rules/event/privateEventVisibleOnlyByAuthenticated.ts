import { Handler, NextFunction, Request, Response } from 'express'
import { Event, EventState } from '@whisbi-events/persistence'
import asyncHandler from '../../error/asyncHandler'

const privateEventVisibleOnlyByAuthenticated: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const event: Event = res.locals.event
  const isAuthenticated = req.user !== undefined

  if (event.state === EventState.PRIVATE && !isAuthenticated) {
    res.status(403).json({ message: 'Private event can be only accessed by authenticated users' })
    return
  }

  next()
}

export default asyncHandler(privateEventVisibleOnlyByAuthenticated)
