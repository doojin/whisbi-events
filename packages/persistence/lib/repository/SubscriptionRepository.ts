import { Repository, EntityRepository } from 'typeorm'
import Subscription from '../entity/Subscription'

@EntityRepository(Subscription)
export default class SubscriptionRepository extends Repository<Subscription> {
  async alreadySubscribed (userId, eventId): Promise<boolean> {
    return await this.createQueryBuilder('subscription')
      .innerJoin('subscription.user', 'user', 'user.id = :userId', { userId })
      .innerJoin('subscription.event', 'event', 'event.id = :eventId', { eventId })
      .getOne() !== undefined
  }

  async getUserSubscriptionCount (userId): Promise<number> {
    return await this.createQueryBuilder('subscription')
      .innerJoin('subscription.user', 'user', 'user.id = :userId', { userId })
      .getCount()
  }
}
