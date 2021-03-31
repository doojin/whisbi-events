import IntegrationTest from './integration'

describe('google authentication endpoint integration test', () => {
  let itest: IntegrationTest

  beforeEach(async () => {
    itest = new IntegrationTest()
    await itest.setUp()
  })

  afterEach(async () => {
    await itest.tearDown()
  })

  test('returns existing user data', async () => {
    itest.mockResolvedGoogleProfile({ id: 'test-google-id' })
    await itest.createUserWithGoogleId('test-google-id')

    await itest.createRequest()
      .post('/api/v1/authentication/google')
      .set('Content-Type', 'application/json')
      .send({
        googleToken: 'test-access-token'
      })
      .expect(200)
      .expect({
        id: 1,
        name: 'user1-name',
        photo: 'user1-photo',
        googleId: 'test-google-id',
        token: {
          id: 1,
          value: 'token1'
        }
      })
  })

  test('creates unexisting user', async () => {
    itest.mockResolvedGoogleProfile({ name: 'google-name', picture: 'google-photo', id: 'test-google-id' })
    itest.mockUuidGeneratedValue('test-token')

    await itest.createRequest()
      .post('/api/v1/authentication/google')
      .set('Content-Type', 'application/json')
      .send({
        googleToken: 'test-access-token'
      })
      .expect(200)
      .expect({
        id: 1,
        name: 'google-name',
        photo: 'google-photo',
        googleId: 'test-google-id',
        token: {
          id: 1,
          value: 'test-token'
        }
      })
  })

  test('sends error occured during Google API request', async () => {
    itest.mockErrorDuringGoogleProfileResolution(new Error('test-error'))

    await itest.createRequest()
      .post('/api/v1/authentication/google')
      .set('Content-Type', 'application/json')
      .send({
        googleToken: 'test-access-oken'
      })
      .expect(500)
      .expect({ error: 'test-error' })
  })

  test('sends error when no Google access token provided', async () => {
    await itest.createRequest()
      .post('/api/v1/authentication/google')
      .set('Content-Type', 'application/json')
      .expect(403)
      .expect({ error: 'Google access token is required for this operation' })
  })
})
