import { Request, Response, NextFunction, Handler } from 'express'
import { Event } from '@whisbi-events/persistence'

const requiredProperties = [
  'headline',
  'description',
  'location',
  'startDate'
]

const isValidEventEntity: Handler = (req: Request, res: Response, next: NextFunction) => {
  const event: Partial<Event> = req.body

  if (event === undefined) {
    res.status(400).json({ error: 'Event entity is missing' })
    return
  }

  for (const requiredProperty of requiredProperties) {
    if (event[requiredProperty] === undefined) {
      res.status(422).json({ error: `Event "${requiredProperty}" property is mandatory` })
      return
    }
  }

  next()
}

export default isValidEventEntity
