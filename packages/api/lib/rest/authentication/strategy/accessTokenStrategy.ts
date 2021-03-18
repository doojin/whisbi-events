import { Strategy } from 'passport-accesstoken'
import { User, getUserRepository } from '@whisbi-events/persistence'

export default new Strategy({ tokenHeader: 'token' }, async (token: string, done: Function) => {
  let user: User | undefined

  try {
    user = await getUserRepository().findByTokenValue(token)
  } catch (e) {
    return done(e)
  }

  if (user === undefined) {
    return done(null, false)
  }

  return done(null, user)
})
