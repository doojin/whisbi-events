import React, { useEffect } from 'react'
import whisbiApi from './api/whisbi'
import { useDispatch, useSelector } from 'react-redux'
import { setEvents, getEvents } from './store/slice/events'
import Event from './Event'
import { Button, CardColumns } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function Events () {
  const dispatch = useDispatch()
  const events = useSelector(getEvents)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const events = await whisbiApi.getEvents()
      dispatch(setEvents(events))
    })()
  }, [])

  const createEventButton = (
    <Button onClick={() => history.push('/event/new')}>
      + Create Event
    </Button>
  )

  const eventCards = events.map(event =>
    <Event key={ event.id } event={ event }/>)

  return (
    <>
      { createEventButton }
      <CardColumns>
        { eventCards }
      </CardColumns>
    </>
  )
}
