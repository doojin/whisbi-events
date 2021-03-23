import { Request, Response, NextFunction } from 'express'
import validEntity from './validEntity'

describe('valid entity rule', () => {
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
    test('sends an message', () => {
      validEntity('TestEntity', [])(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'TestEntity entity is missing' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('required property is missing', () => {
    beforeEach(() => {
      req.body = {}
    })

    test('sends an error', () => {
      validEntity('TestEntity', ['testProp'])(req, res, next)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalledWith({ error: 'TestEntity "testProp" property is mandatory' })
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('correct entity', () => {
    beforeEach(() => {
      req.body = {
        testProp: 'definitely not empty property'
      }
    })

    test('not sets status code', () => {
      validEntity('TestEntity', ['testProp'])(req, res, next)

      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
})
