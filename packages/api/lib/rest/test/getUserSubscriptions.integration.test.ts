import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('user subscriptions endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('can be accessed only by authenticated users', async () => {
    await itest.createRequest()
      .get('/api/v1/user/subscription')
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('returns user subscriptions', async () => {
    const eventOwner = await itest.createUser()
    const event1 = await itest.createEvent(eventOwner, EventState.PUBLIC)
    const event2 = await itest.createEvent(eventOwner, EventState.PUBLIC)
    const event3 = await itest.createEvent(eventOwner, EventState.PUBLIC)
    const event4 = await itest.createEvent(eventOwner, EventState.PUBLIC)

    const subscriber1 = await itest.createUser()
    await itest.createSubscription(subscriber1, event1)
    await itest.createSubscription(subscriber1, event2)

    const subscriber2 = await itest.createUser()
    await itest.createSubscription(subscriber2, event3)
    await itest.createSubscription(subscriber2, event4)

    await itest.createRequest()
      .get('/api/v1/user/subscription')
      .set('token', subscriber2.token.value)
      .expect(200)
      .expect([
        {
          id: 3,
          name: 'subscription3-name',
          email: 'subscription3-email',
          event: {
            id: 3,
            headline: 'event3-headline',
            description: 'event3-description',
            startDate: '1991-03-21T00:00:00.000Z',
            location: 'event3-location',
            state: 'public'
          }
        },
        {
          id: 4,
          name: 'subscription4-name',
          email: 'subscription4-email',
          event: {
            id: 4,
            headline: 'event4-headline',
            description: 'event4-description',
            startDate: '1991-03-21T00:00:00.000Z',
            location: 'event4-location',
            state: 'public'
          }
        }
      ])
  })
})
