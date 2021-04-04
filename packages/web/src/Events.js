import React, { useEffect } from 'react'
import whisbiApi from './api/whisbi'
import { useDispatch, useSelector } from 'react-redux'
import { setEvents, getEvents } from './store/slice/events'
import Event from './Event'
import { Button, CardColumns } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { getUserToken, isAuthenticated } from './store/slice/user'

export default function Events () {
  const dispatch = useDispatch()
  const events = useSelector(getEvents)
  const token = useSelector(getUserToken)
  const history = useHistory()
  const authenticated = useSelector(isAuthenticated)

  useEffect(() => {
    (async () => {
      const events = await whisbiApi.getEvents(token)
      dispatch(setEvents(events))
    })()
  }, [token])

  const createEventButton = (
    <Button onClick={() => history.push('/event/new')}>
      + Create Event
    </Button>
  )

  const myEventsButton = (
    <Button onClick={() => history.push('/event/my')}>
      My Events
    </Button>
  )

  const mySubscriptionsButton = (
    <Button onClick={() => history.push('/subscription/my')}>
      My Subscriptions
    </Button>
  )

  const buttons = authenticated
    ? <div>{ createEventButton } { myEventsButton } { mySubscriptionsButton }</div>
    : null

  const eventCards = events.map(event =>
    <Event key={ event.id } event={ event }/>)

  return (
    <>
      { buttons }
      <CardColumns>
        { eventCards }
      </CardColumns>
    </>
  )
}
