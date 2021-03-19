import { Event, EventState } from '@whisbi-events/persistence'

export function isDraft (event: Partial<Event>): boolean {
  return event.state === undefined || event.state === EventState.DRAFT
}
