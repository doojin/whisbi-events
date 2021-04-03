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

  async findOneAndJoinWithUser (id): Promise<Subscription|undefined> {
    return await this.createQueryBuilder('subscription')
      .where('subscription.id = :id', { id })
      .innerJoinAndSelect('subscription.user', 'user')
      .getOne()
  }

  async getUserSubscriptions (userId): Promise<Subscription[]> {
    return await this.createQueryBuilder('subscription')
      .innerJoin('subscription.user', 'user', 'user.id = :userId', { userId })
      .innerJoinAndSelect('subscription.event', 'event')
      .getMany()
  }

  async findSubscriptionsWithEvents (minDate: Date, maxDate: Date): Promise<Subscription[]> {
    return this.createQueryBuilder('subscription')
      .innerJoinAndSelect('subscription.user', 'user')
      .innerJoinAndSelect('subscription.event', 'event')
      .where('event.startDate between :minDate and :maxDate', { minDate, maxDate })
      .getMany()
  }
}
