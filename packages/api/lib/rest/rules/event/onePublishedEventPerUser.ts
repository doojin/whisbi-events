import { Request, Response, NextFunction, Handler } from 'express'
import { User, getEventRepository } from '@whisbi-events/persistence'
import { isDraft } from '../../util/event'
import asyncHandler from '../../error/asyncHandler'

const onePublishedEventPerUser: Handler = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req.user as User
  const hasNonDraftEvents = await getEventRepository().hasNonDraftUserEvents(userId)

  if (!isDraft(req.body) && hasNonDraftEvents) {
    res.status(400).json({ message: 'User can have only one published event at a time' })
    return
  }

  next()
}

export default asyncHandler(onePublishedEventPerUser)
