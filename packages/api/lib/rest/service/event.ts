import { Event, getEventRepository, User } from '@whisbi-events/persistence'
import HttpError from '../HttpError'

export default {
  async create (eventData: Partial<Event>, user: User): Promise<void> {
    delete eventData.id

    const eventRepository = getEventRepository()
    const hasNonDraftEvents = await eventRepository.hasNonDraftUserEvents(user.id)

    if (hasNonDraftEvents) {
      throw new HttpError(400, 'User can have only one non-draft event at a time')
    }

    const event = eventRepository.create({ ...eventData, user })
    await eventRepository.save(event)
  }
}
