import { Request, Response, NextFunction } from 'express'
import validEventEntity from './validEventEntity'

describe('valid event entity rule', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request
    res = {
      status: jest.fn().mockReturnThis() as Function,
      json: jest.fn() as Function
    } as Response
    next = jest.fn()
  })

  describe('request does not contain entity', () => {
    test('sets bad request status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    test('sends error message', () => {
      validEventEntity(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event entity is missing' })
    })

    test('aborts middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('headline property is missing', () => {
    beforeEach(() => {
      req.body = {}
    })

    test('sets unprocessable entity status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
    })

    test('sends error message', () => {
      validEventEntity(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event "headline" property is mandatory' })
    })

    test('aborts middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('description property is missing', () => {
    beforeEach(() => {
      req.body = {
        headline: 'test headline'
      }
    })

    test('sets unprocessable entity status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
    })

    test('sends error message', () => {
      validEventEntity(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event "description" property is mandatory' })
    })

    test('aborts middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('location property is missing', () => {
    beforeEach(() => {
      req.body = {
        headline: 'test headline',
        description: 'test description'
      }
    })

    test('sets unprocessable entity status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
    })

    test('sends error message', () => {
      validEventEntity(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event "location" property is mandatory' })
    })

    test('aborts middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('startDate property is missing', () => {
    beforeEach(() => {
      req.body = {
        headline: 'test headline',
        description: 'test description',
        location: 'test location'
      }
    })

    test('sets unprocessable entity status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(422)
    })

    test('sends error message', () => {
      validEventEntity(req, res, next)
      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({ error: 'Event "startDate" property is mandatory' })
    })

    test('aborts middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('correct event entity', () => {
    beforeEach(() => {
      req.body = {
        headline: 'test headline',
        description: 'test description',
        location: 'test location',
        startDate: '2020-03-21' // Happy birthday to me! :D
      }
    })

    test('not sets status code', () => {
      validEventEntity(req, res, next)
      expect(res.status).not.toHaveBeenCalled()
    })

    test('not sends any response', () => {
      validEventEntity(req, res, next)
      expect(res.json).not.toHaveBeenCalled()
    })

    test('continues middleware chain', () => {
      validEventEntity(req, res, next)
      expect(next).toHaveBeenCalled()
    })
  })
})
