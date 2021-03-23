import { Request, Response, NextFunction, Handler } from 'express'
import { Event } from '@whisbi-events/persistence'
import asyncHandler from '../error/asyncHandler'

export default function validEntity (entityName: string, requiredProperties: string[]): Handler {
  const isValid: Handler = (req: Request, res: Response, next: NextFunction) => {
    const entity: Partial<Event> = req.body

    if (entity === undefined) {
      res.status(400).json({ error: `${entityName} entity is missing` })
      return
    }

    for (const requiredProperty of requiredProperties) {
      if (entity[requiredProperty] === undefined) {
        res.status(422).json({ error: `${entityName} "${requiredProperty}" property is mandatory` })
        return
      }
    }

    next()
  }

  return asyncHandler(isValid)
}
