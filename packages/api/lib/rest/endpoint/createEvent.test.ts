import request from 'supertest'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import createEvent from './createEvent'
import eventService from '../service/event'

jest.mock('../service/event')

describe('event creation endpoint', () => {
  let app: Express

  beforeEach(() => {
    (eventService.create as jest.Mock).mockResolvedValue({ headline: 'test-headline' })

    app = express()
    app.use(bodyParser.json())
    app.use((req, res, next) => {
      req.user = { name: 'test user' }
      next()
    })
    app.post('/events', createEvent)
  })

  test('creates a new event', async () => {
    await request(app)
      .post('/events')
      .set('Content-Type', 'application/json')
      .send({
        headline: 'test headline'
      })
      .expect(201)
      .expect({ headline: 'test-headline' })

    expect(eventService.create).toHaveBeenCalledTimes(1)
    expect(eventService.create).toHaveBeenCalledWith({ headline: 'test headline' }, { name: 'test user' })
  })
})
