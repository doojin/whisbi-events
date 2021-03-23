import { Handler, Request, Response } from 'express'
import { getEventRepository, EventState } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

function parseIntegerQueryParameter (req: Request, name: string, defaultValue: number): number {
  return req.query[name] !== undefined
    ? parseInt(req.query[name] as string)
    : defaultValue
}

const getEvents: Handler = async (req: Request, res: Response): Promise<void> => {
  const limit = parseIntegerQueryParameter(req, 'limit', 15)
  const offset = parseIntegerQueryParameter(req, 'offset', 0)

  const states = req.user !== undefined
    ? [EventState.PUBLIC, EventState.PRIVATE]
    : [EventState.PUBLIC]

  const events = await getEventRepository().findMultipleEvents(limit, offset, states)

  res.json(events)
}

export default asyncHandler(getEvents)
