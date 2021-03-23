import User from '../entity/User'
import Token from '../entity/Token'
import Event from '../entity/Event'
import Subscription from '../entity/Subscription'
import { createConnection, Connection, getCustomRepository, getRepository } from 'typeorm'
import SubscriptionRepository from './SubscriptionRepository'

describe('subscription repository', () => {
  let connection: Connection
  let subscriptionRepository: SubscriptionRepository

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
        Event,
        Subscription
      ]
    })

    subscriptionRepository = getCustomRepository(SubscriptionRepository)
  })

  afterEach(async () => {
    await connection.close()
  })

  async function generateUser (): Promise<User> {
    const user = new User()
    user.name = 'test-name'
    user.photo = 'test-photo'
    return await getRepository(User).save(user)
  }

  async function generateEvent (user: User): Promise<Event> {
    const event = new Event()
    event.headline = 'test-headline'
    event.description = 'test-description'
    event.startDate = new Date(Date.UTC(1991, 2, 21, 0, 0, 0, 0))
    event.location = 'test-location'
    event.user = user
    return await getRepository(Event).save(event)
  }

  async function generateUserEventSubscription (event: Event, user: User): Promise<void> {
    const subscription = new Subscription()
    subscription.name = 'test-name'
    subscription.email = 'test-email'
    subscription.event = event
    subscription.user = user
    await getRepository(Subscription).save(subscription)
  }

  describe('alreadySubscribed', () => {
    describe('user is already subscribed to given event', () => {
      test('returns true', async () => {
        const user1 = await generateUser()
        const user1Event = await generateEvent(user1)

        const user2 = await generateUser()
        await generateUserEventSubscription(user1Event, user2)

        const alreadySubscribed = await subscriptionRepository.alreadySubscribed(user2.id, user1Event.id)

        expect(alreadySubscribed).toBe(true)
      })
    })

    describe('user not subscribed to given event', () => {
      test('returns false', async () => {
        const user1 = await generateUser()
        const user1Event = await generateEvent(user1)

        const user2 = await generateUser()

        const alreadySubscribed = await subscriptionRepository.alreadySubscribed(user2.id, user1Event.id)

        expect(alreadySubscribed).toBe(false)
      })
    })
  })
})
