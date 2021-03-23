import { Request, Response, NextFunction, Handler } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import asyncHandler from '../../error/asyncHandler'

const existingEvent: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.eventId

  const event = await getEventRepository().findOneAndJoinWithUser(id)

  if (event === undefined) {
    res.status(404).json({ error: 'Event with given id does not exist' })
    return
  }

  // To avoid querying database multiple times in the next middleware, lets assign event to res.locals
  // From express docs:
  // This property is useful for exposing request-level information such as the request path name, authenticated user,
  // user settings, and so on.
  res.locals.event = event

  next()
}

export default asyncHandler(existingEvent)
