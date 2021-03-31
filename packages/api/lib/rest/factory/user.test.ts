import userFactory from './user'
import { getUserRepository, getTokenRepository } from '@whisbi-events/persistence'
import { v4 as uuidv4 } from 'uuid'

jest.mock('@whisbi-events/persistence')
jest.mock('uuid')

describe('user factory', () => {
  let userRepository
  let tokenRepository

  beforeEach(() => {
    userRepository = {
      create: jest.fn().mockImplementation(user => user),
      save: jest.fn()
    }

    tokenRepository = {
      save: jest.fn()
    };

    (uuidv4 as jest.Mock).mockReturnValue('test-token');
    (getUserRepository as jest.Mock).mockReturnValue(userRepository);
    (getTokenRepository as jest.Mock).mockReturnValue(tokenRepository)
  })

  test('creates user and it\'s token', async () => {
    const user = await userFactory.create({ name: 'test-name' }, 'test-google-id')

    expect(userRepository.save).toHaveBeenCalledWith({
      name: 'test-name',
      googleId: 'test-google-id',
      token: {
        value: 'test-token'
      }
    })

    expect(tokenRepository.save).toHaveBeenCalledWith({
      value: 'test-token'
    })

    expect(user).toEqual({
      name: 'test-name',
      googleId: 'test-google-id',
      token: {
        value: 'test-token'
      }
    })
  })
})
