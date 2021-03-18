import { EntityRepository, Repository } from 'typeorm'
import Event from '../entity/Event'
import EventState from '../entity/EventState'

@EntityRepository(Event)
export default class EventRepository extends Repository<Event> {
  async getNonDraftEventCount (userId: number): Promise<number> {
    return await this.createQueryBuilder('event')
      .where('event.state != :state', { state: EventState.DRAFT })
      .innerJoin('event.user', 'user', 'user.id = :userId', { userId })
      .getCount()
  }
}