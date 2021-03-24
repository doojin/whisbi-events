import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('get single event endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('user can\'t access not existing event', async () => {
    await itest.createRequest()
      .get('/api/v1/event/13')
      .expect(404)
      .expect({ error: 'Event with given id does not exist' })
  })

  test('draft events are only accessible by event owners', async () => {
    const eventOwner = await itest.createUser()
    const event = await itest.createEvent(eventOwner, EventState.DRAFT)

    const notEventOwner = await itest.createUser()

    // anonymous user request -> forbidden error
    await itest.createRequest()
      .get(`/api/v1/event/${event.id}`)
      .expect(403) // forbidden
      .expect({ error: 'Draft event can be only accessed by event owner' })

    await itest.createRequest()
      .get(`/api/v1/event/${event.id}`)
      .set('token', notEventOwner.token.value) // non-event-owner request -> forbidden error
      .expect(403) // forbidden
      .expect({ error: 'Draft event can be only accessed by event owner' })

    await itest.createRequest()
      .get(`/api/v1/event/${event.id}`)
      .set('token', eventOwner.token.value) // event owner request -> show entity
      .expect(200) // you're welcome :)
      .expect({
        id: 1,
        headline: 'event1-headline',
        description: 'event1-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event1-location',
        state: 'draft'
      })
  })

  test('anonymous users can\'t see private events', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PRIVATE)

    await itest.createRequest()
      .get(`/api/v1/event/${event.id}`)
      .expect(403)
      .expect({ error: 'Private event can be only accessed by authenticated users' })
  })

  test('authenticated users can see private events', async () => {
    const user = await itest.createUser()
    const event = await itest.createEvent(user, EventState.PRIVATE)

    const anotherUser = await itest.createUser()

    await itest.createRequest()
      .get(`/api/v1/event/${event.id}`)
      .set('token', anotherUser.token.value)
      .expect(200)
      .expect({
        id: 1,
        headline: 'event1-headline',
        description: 'event1-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event1-location',
        state: 'private'
      })
  })
})
