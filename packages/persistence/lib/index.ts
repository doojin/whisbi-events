import path from 'path'
import {
  createConnection as createDatabaseConnection,
  getCustomRepository,
  getRepository,
  Repository
} from 'typeorm'
import User from './entity/User'
import Token from './entity/Token'
import Event from './entity/Event'
import UserRepository from './repository/UserRepository'

export async function createConnection (
  database: string,
  username: string,
  password: string,
  synchronize: boolean = false
): Promise<void> {
  await createDatabaseConnection({
    type: 'mysql',
    database,
    username,
    password,
    entities: [
      path.join(__dirname, '../dist/entity/*.js')
    ],
    synchronize
  })
}

export function getUserRepository (): UserRepository {
  return getCustomRepository(UserRepository)
}

export function getEventRepository (): Repository<Event> {
  return getRepository(Event)
}

export { User, Token, Event }
