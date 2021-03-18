import passport from 'passport'
import { Handler } from 'express'
import accessTokenStrategy from './strategy/accessTokenStrategy'
import anonymousStrategy from './strategy/anonymousStrategy'

passport.use(accessTokenStrategy)
passport.use(anonymousStrategy)

export default function authenticate (): Handler {
  return passport.authenticate(['token', 'anonymous'], { session: false })
}
