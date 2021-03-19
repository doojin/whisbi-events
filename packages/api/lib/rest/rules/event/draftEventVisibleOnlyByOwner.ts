import { Request, Response, NextFunction, Handler } from 'express'
import { Event, User } from '@whisbi-events/persistence'
import { isDraft } from '../../util/event'
import asyncHandler from '../../error/asyncHandler'

const draftEventVisibleOnlyByOwner: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const event: Event = res.locals.event
  const currentUser = req.user as User

  if (isDraft(event) && (currentUser === undefined || currentUser.id !== event.user.id)) {
    res.status(403).json({ message: 'Draft event can be only accessed by event owner' })
    return
  }

  next()
}

export default asyncHandler(draftEventVisibleOnlyByOwner)
