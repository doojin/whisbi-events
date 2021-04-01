import restService from './rest'
import {
  createConnection,
  getUserRepository,
  getTokenRepository,
  Token,
  User,
  Event,
  EventState, getEventRepository
} from '@whisbi-events/persistence'
import { loremIpsum } from 'lorem-ipsum'

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
    user.photo = 'https://i.pravatar.cc/300'

    await getUserRepository().save(user)

    const token = new Token()
    token.value = `test-token${i + 1}`
    token.user = user

    await getTokenRepository().save(token)

    // 4 fake public events
    if ([6, 7, 8, 9].includes(i)) {
      const event = new Event()
      event.location = loremIpsum({ count: 2, units: 'words', random: Math.random })
      event.startDate = new Date()
      event.headline = loremIpsum({ count: 4, units: 'words', random: Math.random })
      event.description = loremIpsum({ count: 15, units: 'words', random: Math.random })
      event.state = EventState.PUBLIC
      event.user = user

      await getEventRepository().save(event)
    }
  }

  restService.start(8000)
})()
