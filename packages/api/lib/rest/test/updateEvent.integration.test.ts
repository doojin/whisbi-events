import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('update event endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('anonymous users can\'t update an event', async () => {
    // anonymous request
    await itest.createRequest()
      .put('/api/v1/event/13')
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('user can\'t update another user\'s event', async () => {
    const firstUser = await itest.createUser()
    const firstUserEvent = await itest.createEvent(firstUser, EventState.PUBLIC)

    const secondUser = await itest.createUser()

    await itest.createRequest()
      .put(`/api/v1/event/${firstUserEvent.id}`)
      .set('token', secondUser.token.value)
      .expect(403)
      .expect({ error: 'This operation is accessible only by event owner' })
  })

  test('event owner can update his event', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.PUBLIC)

    await itest.createRequest()
      .put(`/api/v1/event/${event.id}`)
      .set('token', eventOwner.token.value)
      .send({
        headline: 'updated-headline',
        description: 'updated-description',
        startDate: '1991-03-21',
        location: 'updated-location',
        state: 'private'
      })
      .expect(200)
      .expect({
        id: 1,
        headline: 'updated-headline',
        description: 'updated-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'updated-location',
        state: 'private'
      })
  })

  test('user can\'t update not existing event', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .put('/api/v1/event/13')
      .set('token', user.token.value)
      .expect(404)
      .expect({ error: 'Event with given id does not exist' })
  })

  test('user can\'t set non-draft event state if he has another non-draft event', async () => {
    const user = await itest.createUser()
    await itest.createEvent(user, EventState.PUBLIC)
    const draftEvent = await itest.createEvent(user, EventState.DRAFT)

    // User has 2 events: public and draft
    // User tries to change draft event to private
    // This is forbidden because amount of published events will become 2!

    await itest.createRequest()
      .put(`/api/v1/event/${draftEvent.id}`)
      .set('token', user.token.value)
      .send({
        headline: 'updated-headline',
        description: 'updated-description',
        startDate: '1991-03-21',
        location: 'updated-location',
        state: 'private' // changing draft to private!
      })
      .expect(400)
      .expect({ error: 'User can have only one published event at a time' })
  })

  test('user should set all mandatory event properties', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PUBLIC)

    await itest.createRequest()
      .put(`/api/v1/event/${event.id}`)
      .set('token', user.token.value)
      .send({})
      .expect(422)
      .expect({ error: 'Event "headline" property is mandatory' })

    await itest.createRequest()
      .put(`/api/v1/event/${event.id}`)
      .set('token', user.token.value)
      .send({
        headline: 'test-headline'
      })
      .expect(422)
      .expect({ error: 'Event "description" property is mandatory' })

    await itest.createRequest()
      .put(`/api/v1/event/${event.id}`)
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description'
      })
      .expect(422)
      .expect({ error: 'Event "startDate" property is mandatory' })

    await itest.createRequest()
      .put(`/api/v1/event/${event.id}`)
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description',
        startDate: '1991-03-21'
      })
      .expect(422)
      .expect({ error: 'Event "location" property is mandatory' })
  })
})
