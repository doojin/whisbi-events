import { Handler, Request, Response } from 'express'
import { Event, User } from '@whisbi-events/persistence'
import eventService from '../service/event'

const createEvent: Handler = async (req: Request, res: Response): Promise<void> => {
  const eventData: Partial<Event> = req.body
  const user = req.user as User

  await eventService.create(eventData, user)

  res.status(201).send()
}

export default createEvent