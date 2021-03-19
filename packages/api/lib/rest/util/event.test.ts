import { Event, EventState } from '@whisbi-events/persistence'
import { isDraft } from './event'

describe('event util', () => {
  describe('isDraft', () => {
    let event: Partial<Event>

    describe('event state is undefined', () => {
      beforeEach(() => {
        event = {}
      })

      test('returns true', () => {
        expect(isDraft(event)).toBeTruthy()
      })
    })

    describe('event state is draft', () => {
      beforeEach(() => {
        event = {
          state: EventState.DRAFT
        }
      })

      test('returns true', () => {
        expect(isDraft(event)).toBeTruthy()
      })
    })

    describe('event state is not draft', () => {
      beforeEach(() => {
        event = {
          state: EventState.PUBLIC
        }
      })

      test('returns false', () => {
        expect(isDraft(event)).toBeFalsy()
      })
    })
  })
})
