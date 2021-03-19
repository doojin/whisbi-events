import eventService from './event'
import { getEventRepository, User, Event } from '@whisbi-events/persistence'
import HttpError from '../error/HttpError'
import EventState from '@whisbi-events/persistence/dist/entity/EventState'

jest.mock('@whisbi-events/persistence')

describe('event service', () => {
  let eventRepository

  beforeEach(() => {
    eventRepository = {
      insert: jest.fn().mockResolvedValue({
        raw: {
          insertId: 13
        }
      }),
      findOne: jest.fn(),
      hasNonDraftUserEvents: jest.fn()
    };

    (getEventRepository as jest.Mock).mockReturnValue(eventRepository)
  })

  describe('create', () => {
    describe('user has no non-draft events', () => {
      beforeEach(() => {
        eventRepository.hasNonDraftUserEvents.mockResolvedValue(false)
      })

      test('inserts new user event', async () => {
        const user: User = new User()

        await eventService.create({ id: 13, headline: 'test event' }, user)

        expect(eventRepository.insert).toHaveBeenCalledTimes(1)
        expect(eventRepository.insert).toHaveBeenCalledWith({
          headline: 'test event',
          user
        })
      })
    })

    describe('user has existing non-draft event', () => {
      let eventData: Partial<Event>

      beforeEach(() => {
        eventRepository.hasNonDraftUserEvents.mockResolvedValue(true)
      })

      describe('user creates another non-draft event', () => {
        beforeEach(() => {
          eventData = {
            headline: 'test event',
            state: EventState.PRIVATE
          }
        })

        test('throws error', async () => {
          await expect(eventService.create(eventData, new User()))
            .rejects.toEqual(new HttpError(400, 'User can have only one non-draft event at a time'))
        })
      })

      describe('user creates draft event', () => {
        beforeEach(() => {
          eventData = {
            headline: 'test event',
            state: EventState.DRAFT
          }
        })

        test('No error is thrown', async () => {
          await eventService.create(eventData, new User())
          expect(eventRepository.insert).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
