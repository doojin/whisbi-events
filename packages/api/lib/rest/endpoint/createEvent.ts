import { Handler, Request, Response } from 'express'
import { Event, User, getEventRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const createEvent: Handler = async (req: Request, res: Response): Promise<void> => {
  const eventData: Partial<Event> = req.body
  const user = req.user as User
  const eventRepository = getEventRepository()

  const { raw: { insertId: eventId } } = await eventRepository.insert({ ...eventData, user, id: undefined })
  const event = await eventRepository.findOne(eventId)

  res.status(201).json(event)
}

export default asyncHandler(createEvent)
