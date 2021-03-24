import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('get multiple events integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('user can set custom offset and limit values', async () => {
    const eventOwner = await itest.createUser()
    await itest.createEvent(eventOwner, EventState.PUBLIC)
    await itest.createEvent(eventOwner, EventState.PUBLIC)
    await itest.createEvent(eventOwner, EventState.PUBLIC)
    await itest.createEvent(eventOwner, EventState.PUBLIC)

    // 4 public events exist.
    // Lets limit results to 2 and use an offset of 1 (show events: 2-3)

    await itest.createRequest()
      .get('/api/v1/event?offset=1&limit=2')
      .expect(200)
      .expect([{
        id: 2,
        headline: 'event2-headline',
        description: 'event2-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event2-location',
        state: 'public'
      }, {
        id: 3,
        headline: 'event3-headline',
        description: 'event3-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event3-location',
        state: 'public'
      }])
  })

  test('anonymous users can see only public events', async () => {
    const user1 = await itest.createUser()
    await itest.createEvent(user1, EventState.DRAFT)

    const user2 = await itest.createUser()
    await itest.createEvent(user2, EventState.PUBLIC)

    const user3 = await itest.createUser()
    await itest.createEvent(user3, EventState.PRIVATE)

    await itest.createRequest()
      .get('/api/v1/event')
      .expect(200)
      .expect([{
        id: 2,
        headline: 'event2-headline',
        description: 'event2-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event2-location',
        state: 'public'
      }])
  })

  test('authenticated users can see both: private and public events but not draft', async () => {
    const user1 = await itest.createUser()
    await itest.createEvent(user1, EventState.DRAFT)

    const user2 = await itest.createUser()
    await itest.createEvent(user2, EventState.PUBLIC)

    const user3 = await itest.createUser()
    await itest.createEvent(user3, EventState.PRIVATE)

    const user4 = await itest.createUser()

    await itest.createRequest()
      .get('/api/v1/event')
      .set('token', user4.token.value)
      .expect(200)
      .expect([{
        id: 2,
        headline: 'event2-headline',
        description: 'event2-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event2-location',
        state: 'public'
      }, {
        id: 3,
        headline: 'event3-headline',
        description: 'event3-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'event3-location',
        state: 'private'
      }])
  })
})
