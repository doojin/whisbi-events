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

  async function generateUserEventSubscription (event: Event, user: User): Promise<Subscription> {
    const subscription = new Subscription()
    subscription.name = 'test-name'
    subscription.email = 'test-email'
    subscription.event = event
    subscription.user = user
    return await getRepository(Subscription).save(subscription)
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

  describe('getUserSubscriptionCount', () => {
    test('returns amount of user subscriptions', async () => {
      const user1 = await generateUser()
      const user1Event1 = await generateEvent(user1)
      const user1Event2 = await generateEvent(user1)

      const user2 = await generateUser()
      const user2Event1 = await generateEvent(user2)
      const user2Event2 = await generateEvent(user2)

      // subscriber1 has 3 subscriptions
      const subscriber1 = await generateUser()
      await generateUserEventSubscription(user1Event1, subscriber1)
      await generateUserEventSubscription(user1Event2, subscriber1)
      await generateUserEventSubscription(user2Event1, subscriber1)

      // subscriber2 has 1 subscription
      const subscriber2 = await generateUser()
      await generateUserEventSubscription(user2Event2, subscriber2)

      expect(await subscriptionRepository.getUserSubscriptionCount(subscriber1.id)).toEqual(3)
      expect(await subscriptionRepository.getUserSubscriptionCount(subscriber2.id)).toEqual(1)
    })
  })

  describe('findOneAndJoinWithUser', () => {
    test('finds user subscription and joins it with user entity', async () => {
      const user = await generateUser()
      const event = await generateEvent(user)
      const subscription = await generateUserEventSubscription(event, user)

      const foundSubscription = await subscriptionRepository.findOneAndJoinWithUser(subscription.id)

      expect(foundSubscription).toEqual({
        id: 1,
        name: 'test-name',
        email: 'test-email',
        user: {
          id: 1,
          name: 'test-name',
          photo: 'test-photo'
        }
      })
    })
  })
})
