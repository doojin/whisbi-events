import { Handler, Request, Response } from 'express'
import { Event, getEventRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const getSingleEvent: Handler = async (req: Request, res: Response): Promise<void> => {
  const event = await getEventRepository().findOne(req.params.id) as Event
  res.json(event)
}

export default asyncHandler(getSingleEvent)
