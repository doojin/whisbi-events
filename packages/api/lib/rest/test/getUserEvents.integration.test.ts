import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('user events endpoint integration test', () => {
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
      .get('/api/v1/user/event')
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('returns user events', async () => {
    const user1 = await itest.createUser()
    await itest.createEvent(user1, EventState.DRAFT)
    await itest.createEvent(user1, EventState.DRAFT)

    const user2 = await itest.createUser()
    await itest.createEvent(user2, EventState.DRAFT)
    await itest.createEvent(user2, EventState.DRAFT)

    await itest.createRequest()
      .get('/api/v1/user/event')
      .set('token', user2.token.value)
      .expect(200)
      .expect([
        {
          id: 3,
          headline: 'event3-headline',
          description: 'event3-description',
          startDate: '1991-03-21T00:00:00.000Z',
          location: 'event3-location',
          state: 'draft'
        },
        {
          id: 4,
          headline: 'event4-headline',
          description: 'event4-description',
          startDate: '1991-03-21T00:00:00.000Z',
          location: 'event4-location',
          state: 'draft'
        }
      ])
  })
})
