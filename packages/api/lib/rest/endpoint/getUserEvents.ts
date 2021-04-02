import { Handler, Request, Response } from 'express'
import { getEventRepository, User } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const getUserEvents: Handler = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as User

  const events = await getEventRepository().findUserEvents(user.id)

  res.json(events)
}

export default asyncHandler(getUserEvents)
