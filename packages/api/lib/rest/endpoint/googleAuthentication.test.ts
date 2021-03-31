import { Request, Response, NextFunction } from 'express'
import { getUserRepository } from '@whisbi-events/persistence'
import userProfileFetcher from '../google/userProfileFetcher'
import userFactory from '../factory/user'
import googleAuthentication from './googleAuthentication'

jest.mock('@whisbi-events/persistence')
jest.mock('../google/userProfileFetcher')
jest.mock('../factory/user')

describe('google authentication endpoint', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  let userRepository

  beforeEach(() => {
    req = {
      body: {
        googleToken: 'test-google-token'
      }
    } as Request

    res = {
      json: jest.fn()
    } as any as Response

    next = jest.fn()

    userRepository = {
      findByGoogleId: jest.fn()
    };

    (userProfileFetcher.fetch as jest.Mock).mockResolvedValue({
      id: 'test-id',
      name: 'test-name',
      picture: 'test-picture'
    });

    (getUserRepository as jest.Mock).mockReturnValue(userRepository);

    (userFactory.create as jest.Mock).mockResolvedValue({
      name: 'new-user'
    })
  })

  describe('user with given google id already exists', () => {
    beforeEach(() => {
      userRepository.findByGoogleId.mockResolvedValue({
        name: 'existing-user'
      })
    })

    test('returns user', async () => {
      await googleAuthentication(req, res, next)

      expect(res.json).toHaveBeenCalledWith({ name: 'existing-user' })
      expect(userFactory.create).not.toHaveBeenCalled()
    })
  })

  describe('user with given google id not exists', () => {
    beforeEach(() => {
      userRepository.findByGoogleId.mockResolvedValue(undefined)
    })

    test('creates new users', async () => {
      await googleAuthentication(req, res, next)

      expect(res.json).toHaveBeenCalledWith({ name: 'new-user' })
      expect(userFactory.create).toHaveBeenCalledTimes(1)
    })
  })
})
