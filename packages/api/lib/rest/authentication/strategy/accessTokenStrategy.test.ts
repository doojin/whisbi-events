import passport from 'passport'
import accessTokenStrategy from './accessTokenStrategy'
import { getUserRepository } from '@whisbi-events/persistence'
import request from 'supertest'
import express, { Express } from 'express'

jest.mock('@whisbi-events/persistence')

describe('access token strategy', () => {
  let app: Express
  let userRepository

  beforeEach(() => {
    passport.use(accessTokenStrategy)

    app = express()
    app.use(passport.initialize())

    app.get('/test', passport.authenticate('token', { session: false }), (req, res) => {
      res.sendStatus(200)
    })

    userRepository = {
      findByTokenValue: jest.fn()
    };

    (getUserRepository as jest.Mock).mockReturnValue(userRepository)
  })

  describe('request without token header', () => {
    test('unauthorized status is sent', async () => {
      await request(app)
        .get('/test')
        .expect(401)
    })
  })

  describe('user with token found', () => {
    beforeEach(() => {
      userRepository.findByTokenValue.mockResolvedValue({ username: 'test' })
    })

    test('OK response is sent', async () => {
      await request(app)
        .get('/test')
        .set('token', 'test token')
        .expect(200)
    })
  })

  describe('user with token not found', () => {
    beforeEach(() => {
      userRepository.findByTokenValue.mockResolvedValue(undefined)
    })

    test('unauthorized status is sent', async () => {
      await request(app)
        .get('/test')
        .set('token', 'test token')
        .expect(401)
    })
  })

  describe('error during token search', () => {
    beforeEach(() => {
      userRepository.findByTokenValue.mockRejectedValue('test error')
    })

    test('internal server error status is sent', async () => {
      await request(app)
        .get('/test')
        .set('token', 'test token')
        .expect(500)
    })
  })
})
