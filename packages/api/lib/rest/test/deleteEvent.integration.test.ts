import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('delete event endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('anonymous users can\'t delete events', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PUBLIC)

    // anonymous request
    await itest.createRequest()
      .delete(`/api/v1/event/${event.id}`)
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('user can\'t delete other users\' events', async () => {
    const firstUser = await itest.createUser()
    const firstUserEvent = await itest.createEvent(firstUser, EventState.PUBLIC)

    const secondUser = await itest.createUser()

    await itest.createRequest()
      .delete(`/api/v1/event/${firstUserEvent.id}`)
      .set('token', secondUser.token.value)
      .expect(403)
      .expect({ error: 'This operation is accessible only by event owner' })
  })

  test('event owner can delete his event', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PUBLIC)

    await itest.createRequest()
      .delete(`/api/v1/event/${event.id}`)
      .set('token', user.token.value)
      .expect(204) // no content
      .expect({})
  })

  test('user can\'t delete not existing event', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .delete('/api/v1/event/13')
      .set('token', user.token.value)
      .expect(404)
      .expect({ error: 'Event with given id does not exist' })
  })
})
