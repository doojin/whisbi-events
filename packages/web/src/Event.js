import React from 'react'
import PropTypes from 'prop-types'
import './Event.css'
import { Card } from 'react-bootstrap'

export default function Event ({ event }) {
  return (
    <Card className="Event">
      <h1>{ event.headline }</h1>
      <p className="Description">{ event.description }</p>
      <div>{ event.startDate } - { event.location }</div>
    </Card>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    headline: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    location: PropTypes.string
  })
}
