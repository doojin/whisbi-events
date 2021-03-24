import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('create subscription endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('anonymous users can\'t subscribe to events', async () => {
    // anonymous request
    await itest.createRequest()
      .post('/api/v1/event/1/subscription')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('users can\'t subscribe to not existing event', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .post('/api/v1/event/1/subscription')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({})
      .expect(404)
      .expect({ error: 'Event with given id does not exist' })
  })

  test('users can\'t subscribe to draft event', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.DRAFT)

    const subscriber = await itest.createUser()

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({})
      .expect(403)
      .expect({ error: 'Draft event can be only accessed by event owner' })
  })

  test('user can\'t subscribe to his own event', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PUBLIC)

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({})
      .expect(401) // Honestly not sure about which status code to use: 401 vs 403 vs just 400
      .expect({ error: 'This operation is forbidden for given event owner' })
  })

  test('users can\'t subscribe to the same event twice', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.PUBLIC)

    const subscriber = await itest.createUser()
    await itest.createSubscription(subscriber, event)

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({})
      .expect(400)
      .expect({ error: 'User is already subscribed to the given event' })
  })

  test('user can have a maximum of 3 subscriptions', async () => {
    const user1 = await itest.createUser()
    const event1 = await itest.createEvent(user1, EventState.PUBLIC)

    const user2 = await itest.createUser()
    const event2 = await itest.createEvent(user2, EventState.PUBLIC)

    const user3 = await itest.createUser()
    const event3 = await itest.createEvent(user3, EventState.PUBLIC)

    const user4 = await itest.createUser()
    const event4 = await itest.createEvent(user4, EventState.PUBLIC)

    const subscriber = await itest.createUser()
    // lets subscribe to 3 events...
    await itest.createSubscription(subscriber, event1)
    await itest.createSubscription(subscriber, event2)
    await itest.createSubscription(subscriber, event3)

    // ...and try to subscribe to the 4th
    await itest.createRequest()
      .post(`/api/v1/event/${event4.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({})
      .expect(400)
      .expect({ error: 'User cannot have more than 3 subscriptions' })
  })

  test('user must provide correct subscription data', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.PUBLIC)

    const subscriber = await itest.createUser()

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({})
      .expect(422)
      .expect({ error: 'Subscription "name" property is mandatory' })

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({
        name: 'test-name'
      })
      .expect(422)
      .expect({ error: 'Subscription "email" property is mandatory' })

    await itest.createRequest()
      .post(`/api/v1/event/${event.id}/subscription`)
      .set('Content-Type', 'application/json')
      .set('token', subscriber.token.value)
      .send({
        name: 'test-name',
        email: 'test-email'
      })
      .expect(201) // created
      .expect({
        id: 1,
        name: 'test-name',
        email: 'test-email'
      })
  })
})
