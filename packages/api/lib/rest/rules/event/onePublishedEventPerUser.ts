import { Request, Response, NextFunction, Handler } from 'express'
import { User, getEventRepository } from '@whisbi-events/persistence'
import { isDraft } from '../../util/event'
import asyncHandler from '../../error/asyncHandler'

const onePublishedEventPerUser: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req.user as User
  const updatingEventId: string|undefined = req.params.eventId
  const existingEventId = await getEventRepository().getExistingUserNonDraftEventId(userId)

  // The event entity we try to create/update has non-draft (public/private) state AND
  // Event with public/private state already exists for this user AND
  // The existing event is not the one we try to update now
  if (!isDraft(req.body) && existingEventId !== undefined && (existingEventId.toString() !== updatingEventId)) {
    res.status(400).json({ error: 'User can have only one published event at a time' })
    return
  }

  next()
}

export default asyncHandler(onePublishedEventPerUser)
