import React, { useEffect, useState } from 'react'
import whisbiApi from './api/whisbi'
import { getUserToken } from './store/slice/user'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import BackToEventsButton from './BackToEventsButton'
import './EventDetails.css'
import StateIcon from './StateIcon'
import EventDate from './EventDate'

export default function EventDetails () {
  const { id: eventId } = useParams()
  const [event, setEvent] = useState()

  const token = useSelector(getUserToken)

  useEffect(() => {
    (async () => {
      const fetchedEvent = await whisbiApi.getEvent(eventId, token)
      setEvent(fetchedEvent)
    })()
  }, [])

  const eventDetails = event !== undefined
    ? (
    <div className="EventDetails">
      <h1>{ event.headline }</h1>
      <p>{ event.description }</p>
      <p>
        Start date:
        <span className="value">
          <EventDate date={ event.startDate }/>
        </span>
      </p>
      <p>Location: <span className="value">{ event.location }</span></p>
      <p>Event state: <StateIcon state={event.state}/> <span className="value">{ event.state }</span></p>
    </div>
      )
    : null

  return (
    <>
      <div className="Links">
        <BackToEventsButton/>
      </div>

      { eventDetails }
    </>
  )
}

EventDetails.propTypes = {
  eventId: PropTypes.string
}
