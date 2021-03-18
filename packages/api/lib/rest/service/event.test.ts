import eventService from './event'
import { getEventRepository, User } from '@whisbi-events/persistence'
import HttpError from '../HttpError'

jest.mock('@whisbi-events/persistence')

describe('event service', () => {
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      create: jest.fn(),
      save: jest.fn(),
      hasNonDraftUserEvents: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  describe('create', () => {
    describe('user has no non-draft events', () => {
      beforeEach(() => {
        eventRepository.hasNonDraftUserEvents.mockResolvedValue(false)
      })

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

    describe('user has non-draft event', () => {
      beforeEach(() => {
        eventRepository.hasNonDraftUserEvents.mockResolvedValue(true)
      })

      test('throws exception', async () => {
        await expect(eventService.create({ id: 13, headline: 'test event' }, new User()))
          .rejects.toEqual(new HttpError(400, 'User can have only one non-draft event at a time'))
      })
    })
  })
})
