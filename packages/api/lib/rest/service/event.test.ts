import eventService from './event'
import { getEventRepository, User } from '@whisbi-events/persistence'

jest.mock('@whisbi-events/persistence')

describe('event service', () => {
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      create: jest.fn(),
      save: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  describe('create', () => {
    test('creates user event', async () => {
      const user: User = new User()

      await eventService.create({ id: 13, headline: 'test event' }, user)

      expect(eventRepository.create).toHaveBeenCalledTimes(1)
      expect(eventRepository.create).toHaveBeenCalledWith({
        headline: 'test event',
        user
      })
      expect(eventRepository.save).toHaveBeenCalledTimes(1)
    })
  })
})
