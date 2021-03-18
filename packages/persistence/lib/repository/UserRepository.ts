import { Repository, EntityRepository } from 'typeorm'
import User from '../entity/User'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async findByTokenValue (accessToken: string): Promise<User|undefined> {
    return await this.createQueryBuilder('user')
      .innerJoin('user.token', 'token', 'token.value = :token', { token: accessToken })
      .getOne()
  }
}
