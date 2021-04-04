import events from 'events'
import { getSubscriptionRepository, Subscription } from '@whisbi-events/persistence'
import add from 'date-fns/add'

export default class SubscriptionEmitter extends events.EventEmitter {
  private readonly subscriptionRepository = getSubscriptionRepository()

  constructor () {
    super()
    setInterval(async () => this.emitSubscriptions(), 5 * 1000)
  }

  private async emitSubscriptions (): Promise<void> {
    const pendingSubscriptions = await this.querySubscriptions()
    pendingSubscriptions.forEach(subscription => this.emit('subscription', subscription))
  }

  private async querySubscriptions (): Promise<Subscription[]> {
    const minDate = add(new Date(), { days: 1 })
    const maxDate = add(minDate, { seconds: 5 })
    return this.subscriptionRepository.findSubscriptionsWithEvents(minDate, maxDate)
  }
}
