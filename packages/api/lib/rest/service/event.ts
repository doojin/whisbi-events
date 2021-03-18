import { Event, getEventRepository, User } from '@whisbi-events/persistence'

export default {
  async create (eventData: Partial<Event>, user: User): Promise<void> {
    delete eventData.id

    const eventRepository = getEventRepository()
    const event = eventRepository.create({ ...eventData, user })
    await eventRepository.save(event)
  }
}
