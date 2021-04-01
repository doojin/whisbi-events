import React, { useEffect } from 'react'
import whisbiApi from './api/whisbi'
import { useDispatch, useSelector } from 'react-redux'
import { setEvents, getEvents } from './store/slice/events'
import Event from './Event'
import { CardColumns } from 'react-bootstrap'

export default function Events () {
  const dispatch = useDispatch()
  const events = useSelector(getEvents)

  useEffect(() => {
    (async () => {
      const events = await whisbiApi.getEvents()
      dispatch(setEvents(events))
    })()
  }, [])

  const eventCards = events.map(event => <Event key={ event.id } event={ event }/>)

  return (
    <CardColumns>
      { eventCards }
    </CardColumns>
  )
}
