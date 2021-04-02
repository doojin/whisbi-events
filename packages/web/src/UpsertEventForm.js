import React, { useEffect, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import './EventForm.css'
import whisbiApi from './api/whisbi'
import { useHistory, useParams } from 'react-router-dom'
import { getUserToken } from './store/slice/user'
import { useSelector } from 'react-redux'
import BackToEventsButton from './BackToEventsButton'
import notifications from './notifications'

export default function UpsertEventForm () {
  const [headline, setHeadline] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString())
  const [location, setLocation] = useState('')
  const [state, setState] = useState('draft')

  const { id: eventId } = useParams()
  const history = useHistory()
  const token = useSelector(getUserToken)

  useEffect(() => {
    (async () => {
      if (eventId) {
        const existingEvent = await whisbiApi.getEvent(eventId, token)
        setHeadline(existingEvent.headline)
        setDescription(existingEvent.description)
        setStartDate(existingEvent.startDate)
        setLocation(existingEvent.location)
        setState(existingEvent.state)
      }
    })()
  }, [])

  const submitForm = async (e) => {
    e.preventDefault()

    if (eventId) {
      await whisbiApi.updateEvent(eventId, {
        headline,
        description,
        startDate,
        location,
        state
      }, token)
    } else {
      await whisbiApi.createEvent({
        headline,
        description,
        startDate,
        location,
        state
      }, token)
    }

    history.push('/')

    const message = eventId ? 'Your event was updated!' : 'Your event was created!'
    notifications.success(message)
  }

  return (
    <>
      <div className="Links">
        <BackToEventsButton/>
      </div>

      <Form onSubmit={ submitForm } className="EventForm">
        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>Headline</Form.Label>
              <Form.Control type="text"
                            placeholder="Event Headline"
                            value={ headline }
                            onChange={(e) => setHeadline(e.target.value)}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="text"
                            placeholder="Start Date"
                            value={ startDate }
                            onChange={(e) => setStartDate(e.target.value)}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control type="text"
                            placeholder="Event Location"
                            value={ location }
                            onChange={(e) => setLocation(e.target.value)}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Control as="select"
                            value={ state }
                            onChange={(e) => setState(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea"
                            className="EventDescription"
                            placeholder="Event Description"
                            value={ description }
                            onChange={(e) => setDescription(e.target.value)}/>
            </Form.Group>
          </Col>
        </Form.Row>

        <Button type="submit">Save New Event</Button>
      </Form>
    </>
  )
}
