import { EntityRepository, Repository } from 'typeorm'
import Event from '../entity/Event'
import EventState from '../entity/EventState'

@EntityRepository(Event)
export default class EventRepository extends Repository<Event> {
  async getExistingUserNonDraftEventId (userId: number): Promise<number|undefined> {
    return await this.createQueryBuilder('event')
      .where('event.state != :state', { state: EventState.DRAFT })
      .innerJoin('event.user', 'user', 'user.id = :userId', { userId })
      .getOne()
      .then(event => event?.id)
  }

  async findOneAndJoinWithUser (id): Promise<Event|undefined> {
    return await this.createQueryBuilder('event')
      .where('event.id = :id', { id })
      .innerJoinAndSelect('event.user', 'user')
      .getOne()
  }

  async findMultipleEvents (limit: number, offset: number, states: EventState[]): Promise<Event[]> {
    let queryBuilder = this.createQueryBuilder('event').limit(limit).offset(offset)

    if (states.length !== undefined) {
      queryBuilder = queryBuilder.where('event.state in (:...states)', { states })
    }

    return await queryBuilder.getMany()
  }

  async findUserEvents (userId): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.user', 'user', 'user.id = :userId', { userId })
      .getMany()
  }
}
