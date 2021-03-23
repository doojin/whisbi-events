import { Handler, Request, Response } from 'express'
import { Event, getEventRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const updateEvent: Handler = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.eventId
  const event: Event = req.body

  await getEventRepository().update(id, event)
  const updatedEvent = await getEventRepository().findOne(id)

  res.json(updatedEvent)
}

export default asyncHandler(updateEvent)
