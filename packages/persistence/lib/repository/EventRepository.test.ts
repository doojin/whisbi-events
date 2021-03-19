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
    event.startDate = new Date(Date.UTC(1991, 2, 21, 0, 0, 0, 0))
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

  describe('hasNonDraftUserEvents', () => {
    let user: User

    describe('user has non draft events', () => {
      beforeEach(async () => {
        user = await generateUser()
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.PUBLIC)
        await generateUserEvent(user, EventState.PUBLIC)
        await generateUserEvent(user, EventState.PRIVATE)
      })

      test('returns true', async () => {
        const hasNonDraftEvents = await eventRepository.hasNonDraftUserEvents(user.id)
        expect(hasNonDraftEvents).toBeTruthy()
      })
    })

    describe('all user events are draft', () => {
      beforeEach(async () => {
        user = await generateUser()
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
        await generateUserEvent(user, EventState.DRAFT)
      })

      test('returns false', async () => {
        const hasNonDraftEvents = await eventRepository.hasNonDraftUserEvents(user.id)
        expect(hasNonDraftEvents).toBeFalsy()
      })
    })

    describe('user has no events', () => {
      beforeEach(async () => {
        user = await generateUser()
      })

      test('returns false', async () => {
        const hasNonDraftEvents = await eventRepository.hasNonDraftUserEvents(user.id)
        expect(hasNonDraftEvents).toBeFalsy()
      })
    })
  })

  describe('findOneAndJoinWithUser', () => {
    test('returns event and it\'s owner data', async () => {
      const user = await generateUser()
      const event = await generateUserEvent(user, EventState.PUBLIC)

      const foundEvent = await eventRepository.findOneAndJoinWithUser(event.id)

      expect(foundEvent).toEqual({
        id: 1,
        headline: 'test-headline',
        description: 'test-description',
        location: 'test-location',
        startDate: new Date(Date.UTC(1991, 2, 21, 0, 0, 0, 0)),
        state: EventState.PUBLIC,
        user: {
          id: 1,
          name: 'test-user',
          photo: 'test-photo'
        }
      })
    })
  })
})
