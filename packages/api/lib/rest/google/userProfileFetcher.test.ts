import { google } from 'googleapis'
import userProfileFetcher from './userProfileFetcher'

jest.mock('googleapis')

describe('user profile fetcher', () => {
  let oauth2

  beforeEach(() => {
    google.auth = {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn()
      })) as any
    } as any

    oauth2 = {
      userinfo: {
        get: jest.fn()
      }
    };

    (google.oauth2 as jest.Mock).mockReturnValue(oauth2)
  })

  describe('fetch', () => {
    describe('error is thrown during user profile fetch', () => {
      beforeEach(() => {
        oauth2.userinfo.get.mockImplementation(callback => callback(new Error('test-error')))
      })

      test('re-throws the error', async () => {
        await expect(userProfileFetcher.fetch('test-token')).rejects.toEqual(new Error('test-error'))
      })
    })

    describe('no profile is fetched', () => {
      beforeEach(() => {
        oauth2.userinfo.get.mockImplementation(callback => callback(null, null))
      })

      test('throws an error', async () => {
        await expect(userProfileFetcher.fetch('test-token')).rejects.toEqual(new Error('Cannot fetch user profile'))
      })
    })

    describe('profile is fetched', () => {
      beforeEach(() => {
        oauth2.userinfo.get.mockImplementation(callback => callback(null, {
          data: {
            name: 'test-name'
          }
        }))
      })

      test('returns the fetched profile', async () => {
        const profile = await userProfileFetcher.fetch('test-token')

        expect(profile).toEqual({
          name: 'test-name'
        })
      })
    })
  })
})
