import { Handler, Request, Response } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

const deleteEvent: Handler = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id

  await getEventRepository().delete(id)

  res.status(204).end()
}

export default asyncHandler(deleteEvent)
