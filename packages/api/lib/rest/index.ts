import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import createEvent from './endpoint/createEvent'
import authenticate from './authentication/index'
import authenticated from './rules/authenticated'
import validEventEntity from './rules/event/validEventEntity'
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

export default {
  start (port: number) {
    const router = express.Router()
    const app = express()

    app.use(bodyParser.json())
    app.use(passport.initialize())
    app.use(authenticate())

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
      createSubscription
    )

    return app.listen(port, () => {
      console.log(`REST service started on port: ${port}`)
    })
  }
}
