import getSingleEvent from './getSingleEvent'
import { getEventRepository } from '@whisbi-events/persistence'
import { Request, Response, NextFunction } from 'express'

jest.mock('@whisbi-events/persistence')

describe('get single event endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      findOne: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
    eventRepository.findOne.mockResolvedValue({ id: 13 })

    req = {
      params: { id: '13' }
    } as any as Request

    res = {
      json: jest.fn()
    } as any as Response

    next = jest.fn()
  })

  test('sends event as response body', async () => {
    await getSingleEvent(req, res, next)

    expect(eventRepository.findOne).toHaveBeenCalledWith('13')
    expect(res.json).toHaveBeenCalledWith({ id: 13 })
  })
})
