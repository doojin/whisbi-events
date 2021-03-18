import EventRepository from './EventRepository'
import User from '../entity/User'
import Token from '../entity/Token'
import Event from '../entity/Event'
import EventState from '../entity/EventState'
import { Connection, createConnection, getCustomRepository, getRepository, Repository } from 'typeorm'

describe('user repository', () => {
  let connection: Connection
  let eventRepository: EventRepository
  let userRepository: Repository<User>

  async function generateUser (): Promise<User> {
    const user = new User()
    user.name = 'test-user'
    user.photo = 'test-photo'
    return await userRepository.save(user)
  }

  async function generateUserEvent (user: User, state: EventState): Promise<Event> {
    const event = new Event()
    event.state = state
    event.headline = 'test-headline'
    event.description = 'test-description'
    event.location = 'test-location'
    event.startDate = new Date()
    event.user = user
    return await eventRepository.save(event)
  }

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

    eventRepository = await getCustomRepository(EventRepository)
    userRepository = await getRepository(User)
  })

  afterEach(async () => {
    await connection.close()
  })

  describe('getNonDraftEventCount', () => {
    let user: User

    describe('user has events', () => {
      beforeEach(async () => {
        user = await generateUser()
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.PUBLIC)
        await generateUserEvent(user, EventState.PUBLIC)
        await generateUserEvent(user, EventState.PRIVATE)
      })

      test('returns count of non-draft events', async () => {
        const count = await eventRepository.getNonDraftEventCount(user.id)
        expect(count).toEqual(3)
      })
    })

    describe('user has no events', () => {
      beforeEach(async () => {
        user = await generateUser()
      })

      test('returns zero count', async () => {
        const count = await eventRepository.getNonDraftEventCount(user.id)
        expect(count).toEqual(0)
      })
    })
  })
})
