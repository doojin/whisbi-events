import IntegrationTest from './integration'
import { EventState } from '@whisbi-events/persistence'

describe('create event endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('anonymous users can\'t create new events', async () => {
    // anonymous request
    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect({ error: 'This resource is available only for authenticated users' })
  })

  test('user can\'t create multiple published events', async () => {
    const user = await itest.createUser()
    await itest.createEvent(user, EventState.PUBLIC) // one non-draft event already exists

    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description',
        startDate: '1991-03-21',
        location: 'test-location',
        state: 'public'
      })
      .expect(400)
      .expect({ error: 'User can have only one published event at a time' })
  })

  test('user can create multiple draft events', async () => {
    const user = await itest.createUser()
    // 3 user events already exist; all are draft
    await itest.createEvent(user, EventState.DRAFT)
    await itest.createEvent(user, EventState.DRAFT)
    await itest.createEvent(user, EventState.DRAFT)

    // creating another draft without any problems
    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description',
        startDate: '1991-03-21',
        location: 'test-location',
        state: 'draft'
      })
      .expect(201)
      .expect({
        id: 4,
        headline: 'test-headline',
        description: 'test-description',
        startDate: '1991-03-21T00:00:00.000Z',
        location: 'test-location',
        state: 'draft'
      })
  })

  test('user can\'t create event without headline', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        description: 'test-description',
        startDate: '1991-03-21',
        location: 'test-location',
        state: 'draft'
      })
      .expect(422)
      .expect({ error: 'Event "headline" property is mandatory' })
  })

  test('user can\'t create event without description', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        startDate: '1991-03-21',
        location: 'test-location',
        state: 'draft'
      })
      .expect(422)
      .expect({ error: 'Event "description" property is mandatory' })
  })

  test('user can\'t create event without start date', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description',
        location: 'test-location',
        state: 'draft'
      })
      .expect(422)
      .expect({ error: 'Event "startDate" property is mandatory' })
  })

  test('user can\'t create event without location', async () => {
    const user = await itest.createUser()

    await itest.createRequest()
      .post('/api/v1/event')
      .set('Content-Type', 'application/json')
      .set('token', user.token.value)
      .send({
        headline: 'test-headline',
        description: 'test-description',
        startDate: '1991-03-21',
        state: 'draft'
      })
      .expect(422)
      .expect({ error: 'Event "location" property is mandatory' })
  })
})
