import restService from './rest'
import { createConnection, getUserRepository, getTokenRepository, Token, User } from '@whisbi-events/persistence'

const DROP_SCHEMA_ON_START = true
const SYNC_SCHEMA_ON_START = true;

(async () => {
  const database = process.env.DATABASE_NAME as string
  const username = process.env.DATABASE_USER as string
  const password = process.env.DATABASE_PASSWORD as string

  await createConnection(database, username, password, SYNC_SCHEMA_ON_START, DROP_SCHEMA_ON_START)

  // Lets generate 10 default users
  for (let i = 0; i < 10; i++) {
    const user = new User()
    user.name = `user${i + 1}`
    user.events = []
    user.photo = 'test-photo'

    await getUserRepository().save(user)

    const token = new Token()
    token.value = `test-token${i + 1}`
    token.user = user

    await getTokenRepository().save(token)
  }

  restService.start(8000)
})()
