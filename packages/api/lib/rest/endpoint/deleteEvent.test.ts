import { Request, Response, NextFunction } from 'express'
import { getEventRepository } from '@whisbi-events/persistence'
import deleteEvent from './deleteEvent'

jest.mock('@whisbi-events/persistence')

describe('delete existing event endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let repository

  beforeEach(() => {
    req = {
      params: {
        id: '13'
      }
    } as any as Request

    res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn()
    } as any as Response

    next = jest.fn()

    repository = {
      delete: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(repository)
  })

  test('deletes an existing event', async () => {
    await deleteEvent(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.end).toHaveBeenCalledTimes(1)
  })
})
