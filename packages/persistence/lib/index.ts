import path from 'path'
import {
  createConnection as createDatabaseConnection,
  getConnection as getDatabaseConnection,
  Connection
} from 'typeorm'
import User from './entity/User'

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

export function getConnection (): Connection {
  return getDatabaseConnection()
}

export {
  User
}
