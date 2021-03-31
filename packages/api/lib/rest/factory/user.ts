import { getUserRepository, getTokenRepository, User, Token } from '@whisbi-events/persistence'
import { v4 as uuidv4 } from 'uuid'

export default {
  async create (userData: Partial<User>, googleId: string): Promise<User> {
    const userRepository = getUserRepository()
    const tokenRepository = getTokenRepository()

    const user = userRepository.create(userData)
    user.googleId = googleId
    await userRepository.save(user)

    const token: Token = new Token()
    token.value = uuidv4()
    token.user = user
    await tokenRepository.save(token)

    // @ts-expect-error
    delete token.user
    user.token = token
    return user
  }
}
