import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('delete subscription integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('anonymous users can\'t delete subscriptions', async () => {
    // anonymous request
    await itest.createRequest()
      .delete('/api/v1/subscription/13')
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('user can\'t delete not existing subscription', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .delete('/api/v1/subscription/13')
      .set('token', user.token.value)
      .expect(404)
      .expect({ error: 'Subscription with given id does not exist' })
  })

  test('user can\'t delete a subscription of another user', async () => {
    const user1 = await itest.createUser()
    const event = await itest.createEvent(user1, EventState.PUBLIC)

    const subscriber = await itest.createUser()
    const subscription = await itest.createSubscription(subscriber, event)

    const user2 = await itest.createUser()

    await itest.createRequest()
      .delete(`/api/v1/subscription/${subscription.id}`)
      .set('token', user2.token.value)
      .expect(403)
      .expect({ error: 'This operation is accessible only by subscription owner' })
  })

  test('user can delete it\'s subscription', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.PUBLIC)

    const subscriber = await itest.createUser()
    const subscription = await itest.createSubscription(subscriber, event)

    await itest.createRequest()
      .delete(`/api/v1/subscription/${subscription.id}`)
      .set('token', subscriber.token.value)
      .expect(204) // no content
      .expect({})
  })
})
