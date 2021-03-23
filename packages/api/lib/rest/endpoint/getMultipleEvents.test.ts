import { Request, Response, NextFunction } from 'express'
import getMultipleEvents from './getMultipleEvents'
import {EventState, getEventRepository} from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('get multiple events endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let eventRepository

  beforeEach(() => {
    req = {
      query: {}
    } as Request

    res = {
      json: jest.fn()
    } as any as Response

    eventRepository = {
      findMultipleEvents: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  test('returns multiple events', async () => {
    eventRepository.findMultipleEvents.mockResolvedValue([{ id: 13 }])

    await getMultipleEvents(req, res, next)

    expect(res.json).toHaveBeenCalledWith([{ id: 13 }])
  })

  describe('user is authenticated', () => {
    beforeEach(() => {
      req.user = {}
    })

    test('queries for both: public and private events', async () => {
      req.query = { limit: '1', offset: '2' }

      await getMultipleEvents(req, res, next)

      expect(eventRepository.findMultipleEvents).toHaveBeenCalledWith(1, 2, [EventState.PUBLIC, EventState.PRIVATE])
    })
  })

  describe('user is not authenticated', () => {
    beforeEach(() => {
      req.user = undefined
    })

    test('queries only for public events', async () => {
      req.query = { limit: '1', offset: '2' }

      await getMultipleEvents(req, res, next)

      expect(eventRepository.findMultipleEvents).toHaveBeenCalledWith(1, 2, [EventState.PUBLIC])
    })
  })

  describe('limit query parameter not set', () => {
    beforeEach(() => {
      req.query = {
        offset: '1'
      }
    })

    test('uses default limit value', async () => {
      await getMultipleEvents(req, res, next)

      expect(eventRepository.findMultipleEvents).toHaveBeenCalledWith(15, 1, [EventState.PUBLIC])
    })
  })

  describe('offset query parameter not set', () => {
    beforeEach(() => {
      req.query = {
        limit: '1'
      }
    })

    test('uses default offset value', async () => {
      await getMultipleEvents(req, res, next)

      expect(eventRepository.findMultipleEvents).toHaveBeenCalledWith(1, 0, [EventState.PUBLIC])
    })
  })
})
