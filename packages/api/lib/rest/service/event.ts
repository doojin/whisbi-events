import { Event, getEventRepository, User } from '@whisbi-events/persistence'
import HttpError from '../error/HttpError'
import { isDraft } from '../util/event'

export default {
  async create (eventData: Partial<Event>, user: User): Promise<Event> {
    const eventRepository = getEventRepository()

    // User can have multiple draft events but only one published
    if (!isDraft(eventData) && await eventRepository.hasNonDraftUserEvents(user.id)) {
      throw new HttpError(400, 'User can have only one non-draft event at a time')
    }

    const result = await eventRepository.insert({ ...eventData, user, id: undefined })
    return await eventRepository.findOne(result.raw.insertId) as Event
  }
}
