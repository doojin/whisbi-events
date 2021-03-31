import UserRepository from './UserRepository'
import User from '../entity/User'
import Token from '../entity/Token'
import Event from '../entity/Event'
import { createConnection, Connection, getCustomRepository, getRepository, Repository } from 'typeorm'

describe('user repository', () => {
  let connection: Connection
  let userRepository: UserRepository
  let tokenRepository: Repository<Token>

  beforeEach(async () => {
    connection = await createConnection({
      type: 'mysql',
      username: 'test',
      password: 'test',
      database: 'whisbi_test',
      synchronize: true,
      dropSchema: true,
      entities: [
        User,
        Token,
        Event
      ]
    })

    userRepository = await getCustomRepository(UserRepository)
    tokenRepository = await getRepository(Token)
  })

  afterEach(async () => {
    await connection.close()
  })

  describe('findByTokenValue', () => {
    describe('user with given token exists', () => {
      beforeEach(async () => {
        const user = new User()
        user.name = 'test user name'
        user.photo = 'test photo'
        await userRepository.save(user)

        const token = new Token()
        token.value = 'test token'
        token.user = user
        await tokenRepository.save(token)
      })

      test('returns user entity', async () => {
        const user = await userRepository.findByTokenValue('test token') as User
        expect(user.name).toEqual('test user name')
      })
    })

    describe('user with given token not exists', () => {
      beforeEach(async () => {
        const user = new User()
        user.name = 'test user name'
        user.photo = 'test photo'
        await userRepository.save(user)
      })

      test('returns undefined', async () => {
        const user = await userRepository.findByTokenValue('test token') as User
        expect(user).toBeUndefined()
      })
    })
  })

  describe('findUserByGoogleId', () => {
    test('returns user by it\'s google id', async () => {
      const user1 = new User()
      user1.name = 'user1'
      user1.photo = 'photo'
      user1.googleId = 'google-id-1'
      await userRepository.save(user1)

      const user2 = new User()
      user2.name = 'user2'
      user2.photo = 'photo'
      user2.googleId = 'google-id-2'
      await userRepository.save(user2)

      const user = await userRepository.findByGoogleId('google-id-2')

      expect(user).not.toBeUndefined()
      expect((user as User).name).toEqual('user2')
    })
  })
})
