import request from 'supertest'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import createEvent from './createEvent'
import { getEventRepository } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('event creation endpoint', () => {
  let app: Express
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      insert: jest.fn().mockResolvedValue({
        raw: { insertId: 13 }
      }),
      findOne: jest.fn().mockResolvedValue({
        headline: 'test-headline'
      })
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)

    app = express()
    app.use(bodyParser.json())
    app.use((req, res, next) => {
      req.user = { name: 'test-user' }
      next()
    })
    app.post('/events', createEvent)
  })

  test('creates a new event', async () => {
    await request(app)
      .post('/events')
      .set('Content-Type', 'application/json')
      .send({
        headline: 'test-headline'
      })
      .expect(201)
      .expect({ headline: 'test-headline' })

    expect(eventRepository.insert).toHaveBeenCalledTimes(1)
    expect(eventRepository.insert).toHaveBeenCalledWith({
      headline: 'test-headline',
      user: { name: 'test-user' }
    })
  })
})
