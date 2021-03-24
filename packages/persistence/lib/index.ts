import path from 'path'
import {
  createConnection as createDatabaseConnection,
  getCustomRepository,
  getRepository,
  Repository,
  Connection
} from 'typeorm'
import User from './entity/User'
import Token from './entity/Token'
import Event from './entity/Event'
import EventState from './entity/EventState'
import Subscription from './entity/Subscription'
import UserRepository from './repository/UserRepository'
import EventRepository from './repository/EventRepository'
import SubscriptionRepository from './repository/SubscriptionRepository'

export async function createConnection (
  database: string,
  username: string,
  password: string,
  synchronize: boolean = false,
  dropSchema: boolean = false,
  entities: any[] = [
    path.join(__dirname, '../dist/entity/*.js')
  ]
): Promise<Connection> {
  return await createDatabaseConnection({
    type: 'mysql',
    database,
    username,
    password,
    entities,
    synchronize,
    dropSchema
  })
}

export function getUserRepository (): UserRepository {
  return getCustomRepository(UserRepository)
}

export function getEventRepository (): EventRepository {
  return getCustomRepository(EventRepository)
}

export function getTokenRepository (): Repository<Token> {
  return getRepository(Token)
}

export function getSubscriptionRepository (): SubscriptionRepository {
  return getCustomRepository(SubscriptionRepository)
}

export { User, Token, Event, EventState, Subscription }
