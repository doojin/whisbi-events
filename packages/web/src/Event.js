import React from 'react'
import PropTypes from 'prop-types'
import './Event.css'
import { Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import StateIcon from './StateIcon'
import EventDate from './EventDate'

export default function Event ({ event }) {
  const history = useHistory()

  return (
    <Card className="Event" onClick={() => history.push(`event/${event.id}`)}>
      <Card.Body>
        <Card.Title>
          <StateIcon state={ event.state }/> { event.headline }
        </Card.Title>
        <Card.Text className="Description">
          { event.description }
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <EventDate date={ event.startDate }/> - { event.location }
      </Card.Footer>
    </Card>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.any,
    headline: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    location: PropTypes.string,
    state: PropTypes.string
  })
}
