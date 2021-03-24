import { Repository, EntityRepository } from 'typeorm'
import User from '../entity/User'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async findByTokenValue (accessToken: string): Promise<User|undefined> {
    return await this.createQueryBuilder('user')
      .innerJoin('user.token', 'token', 'token.value = :token', { token: accessToken })
      // 1. Token values do not change frequently
      // 2. Even if it changes, it cannot happen that the same token is assigned to another user
      // 3. This query is used by middleware on every non-anonymous request
      // So lets cache this query for a couple of minutes to remove a bit of stress from our database :)
      .cache(120_000)
      .getOne()
  }
}
