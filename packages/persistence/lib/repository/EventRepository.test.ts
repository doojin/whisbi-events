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

  async function generateUserEvent (user: User, state: EventState = EventState.PUBLIC): Promise<Event> {
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
          googleId: null,
          id: 1,
          name: 'test-user',
          photo: 'test-photo'
        }
      })
    })
  })

  describe('getExistingUserNonDraftEventId', () => {
    describe('user non draft event exists', () => {
      test('returns event id', async () => {
        const user = await generateUser()
        await generateUserEvent(user, EventState.DRAFT)
        const nonDraftEvent = await generateUserEvent(user, EventState.PRIVATE)

        const nonDraftEventId = await eventRepository.getExistingUserNonDraftEventId(user.id)

        expect(nonDraftEventId).toEqual(nonDraftEvent.id)
      })
    })

    describe('user non draft event not exists', () => {
      test('returns undefined', async () => {
        const user = await generateUser()
        await generateUserEvent(user, EventState.DRAFT)

        const nonDraftEventId = await eventRepository.getExistingUserNonDraftEventId(user.id)

        expect(nonDraftEventId).toBeUndefined()
      })
    })
  })

  describe('findMultipleEvents', () => {
    test('returns events considering requested offset, limit and states', async () => {
      const user1 = await generateUser()
      await generateUserEvent(user1, EventState.DRAFT) // 1
      await generateUserEvent(user1, EventState.DRAFT) // 2
      await generateUserEvent(user1, EventState.PRIVATE) // 3
      await generateUserEvent(user1, EventState.PRIVATE) // 4
      await generateUserEvent(user1, EventState.PUBLIC) // 5
      await generateUserEvent(user1, EventState.PUBLIC) // 6

      const user2 = await generateUser()
      await generateUserEvent(user2, EventState.DRAFT) // 7
      await generateUserEvent(user2, EventState.DRAFT) // 8
      await generateUserEvent(user2, EventState.PRIVATE) // 9
      await generateUserEvent(user2, EventState.PRIVATE) // 10
      await generateUserEvent(user2, EventState.PUBLIC) // 11
      await generateUserEvent(user2, EventState.PUBLIC) // 12

      // query 4 events, with offset = 2, filtering by state: private & public
      const limit = 4
      const offset = 2
      const states = [EventState.PRIVATE, EventState.PUBLIC]

      const events = await eventRepository.findMultipleEvents(limit, offset, states)

      // private and public events are: 3, 4, 5, 6, 9, 10, 11, 12
      // after applying offset: 5, 6, 9, 10, 11, 12
      // after applying limit: 5, 6, 9, 10
      expect(events.map(event => event.id)).toEqual([5, 6, 9, 10])
    })
  })

  describe('findUserEvents', () => {
    test('returns user events', async () => {
      const user1 = await generateUser()
      await generateUserEvent(user1)
      await generateUserEvent(user1)

      const user2 = await generateUser()
      await generateUserEvent(user2)
      await generateUserEvent(user2)

      const userEvents = await eventRepository.findUserEvents(user2.id)

      expect(userEvents.map(event => event.id)).toEqual([3, 4])
    })
  })
})
