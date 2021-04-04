import User from '@whisbi-events/persistence/dist/entity/User'
import Token from '@whisbi-events/persistence/dist/entity/Token'
import Event from '@whisbi-events/persistence/dist/entity/Event'
import EventState from '@whisbi-events/persistence/dist/entity/EventState'
import Subscription from '@whisbi-events/persistence/dist/entity/Subscription'
import {
  createConnection,
  getUserRepository,
  getEventRepository,
  getTokenRepository,
  getSubscriptionRepository
} from '@whisbi-events/persistence'
import restService from '../index'
import { Server } from 'http'
import request, { SuperTest, Test } from 'supertest'
import { Connection } from 'typeorm'
import { google } from 'googleapis'
import { v4 as uuidv4 } from 'uuid'

jest.useFakeTimers()
jest.mock('googleapis')
jest.mock('uuid')

export default class IntegrationTest {
  private connection!: Connection
  private server!: Server

  private usersCounter = 0
  private eventsCounter = 0
  private subscriptionsCounter = 0

  private oauth2

  async setUp (): Promise<void> {
    this.connection = await createConnection('localhost', 'whisbi_test', 'test', 'test', true, true, [
      User,
      Token,
      Subscription,
      Event,
      EventState
    ])

    this.server = await restService.start(8888)
  }

  async tearDown (): Promise<void> {
    await this.connection.close()
    await this.server.close()
  }

  createRequest (): SuperTest<Test> {
    return request(this.server)
  }

  async createUser (): Promise<User> {
    const user = new User()
    user.name = `user${++this.usersCounter}-name`
    user.photo = `user${this.usersCounter}-photo`
    await getUserRepository().save(user)

    const token = new Token()
    token.value = `token${this.usersCounter}`
    token.user = user
    user.token = token
    await getTokenRepository().save(token)

    return user
  }

  async createUserWithGoogleId (googleId: string): Promise<User> {
    const user = await this.createUser()
    user.googleId = googleId
    await getUserRepository().update(user.id, { googleId })
    return user
  }

  private mockGoogleApis (): void {
    google.auth = {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn()
      })) as any
    } as any

    this.oauth2 = {
      userinfo: {
        get: jest.fn()
      }
    };

    (google.oauth2 as jest.Mock).mockReturnValue(this.oauth2)
  }

  mockResolvedGoogleProfile (profile: any): void {
    this.mockGoogleApis()
    this.oauth2.userinfo.get.mockImplementation(callback => callback(null, { data: profile }))
  }

  mockErrorDuringGoogleProfileResolution (error: Error): void {
    this.mockGoogleApis()
    this.oauth2.userinfo.get.mockImplementation(callback => callback(error, null))
  }

  mockUuidGeneratedValue (value: string): void {
    (uuidv4 as jest.Mock).mockReturnValue(value)
  }

  async createEvent (user: User, state: EventState): Promise<Event> {
    const event = new Event()
    event.state = state
    event.headline = `event${++this.eventsCounter}-headline`
    event.description = `event${this.eventsCounter}-description`
    event.location = `event${this.eventsCounter}-location`
    event.startDate = new Date(Date.UTC(1991, 2, 21, 0, 0, 0, 0))
    event.user = user
    await getEventRepository().save(event)
    return event
  }

  async createSubscription (user: User, event: Event): Promise<Subscription> {
    const subscription = new Subscription()
    subscription.user = user
    subscription.event = event
    subscription.name = `subscription${++this.subscriptionsCounter}-name`
    subscription.email = `subscription${this.subscriptionsCounter}-email`
    return await getSubscriptionRepository().save(subscription)
  }
}
