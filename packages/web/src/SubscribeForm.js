import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Col } from 'react-bootstrap'
import './SubscribeForm.css'
import whisbiApi from './api/whisbi'
import { useSelector } from 'react-redux'
import { getUserToken } from './store/slice/user'
import notifications from './notifications'
import { useHistory } from 'react-router-dom'

export default function SubscribeForm ({ eventId }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const token = useSelector(getUserToken)
  const history = useHistory()

  const subscribe = async (e) => {
    e.preventDefault()
    await whisbiApi.subscribe(eventId, { name, email }, token)
    notifications.success('You\'ve just subscribed to event')
    history.push('/')
  }

  return (
    <Form onSubmit={ subscribe } className="SubscribeForm">
      <h3>Subscribtion</h3>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text"
                          placeholder="David Jhonson"
                          value={ name }
                          onChange={(e) => setName(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Your Email</Form.Label>
            <Form.Control type="text"
                          placeholder="example@gmail.com"
                          value={ email }
                          onChange={(e) => setEmail(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Subscribe to event</Form.Label>
            <Form.Control as={ Button } type="submit">Subscribe</Form.Control>
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  )
}

SubscribeForm.propTypes = {
  eventId: PropTypes.string
}
