import React from 'react'
import PropTypes from 'prop-types'
import './Event.css'
import { Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function Event ({ event }) {
  const history = useHistory()

  return (
    <Card className="Event" onClick={() => history.push(`event/${event.id}`)}>
      <h1>{ event.headline }</h1>
      <p className="Description">{ event.description }</p>
      <div>{ event.startDate } - { event.location }</div>
    </Card>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string,
    headline: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    location: PropTypes.string
  })
}
