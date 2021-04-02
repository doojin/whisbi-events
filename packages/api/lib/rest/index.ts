import express from 'express'
import cors from 'cors'
import passport from 'passport'
import bodyParser from 'body-parser'
import createEvent from './endpoint/createEvent'
import authenticate from './authentication/index'
import authenticated from './rules/authenticated'
import validEntity from './rules/validEntity'
import onePublishedEventPerUser from './rules/event/onePublishedEventPerUser'
import existingEvent from './rules/event/existingEvent'
import draftEventVisibleOnlyByOwner from './rules/event/draftEventVisibleOnlyByOwner'
import privateEventVisibleOnlyByAuthenticated from './rules/event/privateEventVisibleOnlyByAuthenticated'
import getSingleEvent from './endpoint/getSingleEvent'
import userIsEventOwner from './rules/event/userIsEventOwner'
import updateEvent from './endpoint/updateEvent'
import deleteEvent from './endpoint/deleteEvent'
import getMultipleEvents from './endpoint/getMultipleEvents'
import createSubscription from './endpoint/createSubscription'
import currentUserCantBeEventOwner from './rules/event/currentUserCantBeEventOwner'
import cantSubscribeTwice from './rules/event/subscription/cantSubscribeTwice'
import maxSubscriptions from './rules/event/subscription/maxSubscriptions'
import deleteSubscription from './endpoint/deleteSubscription'
import existingSubscription from './rules/event/subscription/existingSubscription'
import userIsSubscriptionOwner from './rules/event/subscription/userIsSubscriptionOwner'
import limitRequestsPerMinute from './rules/limitRequestsPerMinute'
import googleAuthentication from './endpoint/googleAuthentication'
import googleAccessTokenRequired from './rules/authentication/googleAccessTokenRequired'
import getUserEvents from './endpoint/getUserEvents'

const validEventEntity = validEntity('Event', ['headline', 'description', 'startDate', 'location'])
const validSubscriptionEntity = validEntity('Subscription', ['name', 'email'])

export default {
  start (port: number) {
    const router = express.Router()
    const app = express()

    app.use(bodyParser.json())
    app.use(passport.initialize())
    app.use(authenticate())
    app.use(cors())

    // Rate limiter to protect form Denial of Service attacks.
    app.use(limitRequestsPerMinute({ perIpAddress: 250, perUserToken: 100 }))

    app.use('/api/v1', router)

    // Post new event
    router.post(
      '/event',
      authenticated,
      onePublishedEventPerUser,
      validEventEntity,
      createEvent
    )

    // Get existing event
    router.get(
      '/event/:eventId',
      existingEvent,
      draftEventVisibleOnlyByOwner,
      privateEventVisibleOnlyByAuthenticated,
      getSingleEvent
    )

    // Delete existing event
    router.delete(
      '/event/:eventId',
      authenticated,
      existingEvent,
      userIsEventOwner,
      deleteEvent
    )

    // Update existing event
    router.put(
      '/event/:eventId',
      authenticated,
      existingEvent,
      userIsEventOwner,
      onePublishedEventPerUser,
      validEventEntity,
      updateEvent
    )

    // Get multiple events
    router.get(
      '/event',
      getMultipleEvents
    )

    // Create event subscription
    router.post(
      '/event/:eventId/subscription',
      authenticated,
      existingEvent,
      draftEventVisibleOnlyByOwner,
      currentUserCantBeEventOwner,
      cantSubscribeTwice,
      maxSubscriptions(3),
      validSubscriptionEntity,
      createSubscription
    )

    // Delete existing subscription
    router.delete(
      '/subscription/:subscriptionId',
      authenticated,
      existingSubscription,
      userIsSubscriptionOwner,
      deleteSubscription
    )

    // Getting user token by Google account ID
    router.post(
      '/authentication/google',
      googleAccessTokenRequired,
      googleAuthentication
    )

    // Getting current user events
    router.get(
      '/user/event',
      authenticated,
      getUserEvents
    )

    return app.listen(port, () => {
      console.log(`REST service started on port: ${port}`)
    })
  }
}
