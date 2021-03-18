import { Event, getEventRepository, User } from '@whisbi-events/persistence'
import HttpError from '../error/HttpError'
import EventState from '@whisbi-events/persistence/dist/entity/EventState'

export default {
  async create (eventData: Partial<Event>, user: User): Promise<Event> {
    delete eventData.id
    const eventRepository = getEventRepository()

    if (
      eventData.state !== EventState.DRAFT &&
      eventData.state !== undefined &&
      await eventRepository.hasNonDraftUserEvents(user.id)) {
      throw new HttpError(400, 'User can have only one non-draft event at a time')
    }

    let event = eventRepository.create({ ...eventData, user })
    event = await eventRepository.save(event)

    // Have to re-query saved event because saved object contains current user data (event.user)
    return await eventRepository.findOne(event.id) as Event
  }
}
