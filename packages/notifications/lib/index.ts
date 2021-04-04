import notificationService from './service'
import { createConnection } from '@whisbi-events/persistence'

const port = parseInt(process.env.PORT as string);

(async () => {
  const database = process.env.DATABASE_NAME as string
  const username = process.env.DATABASE_USER as string
  const password = process.env.DATABASE_PASSWORD as string

  await createConnection(database, username, password)

  notificationService.start(port)
})()
