import React from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function BackToEventsButton () {
  const history = useHistory()

  return (
    <Button onClick={() => history.push('/')}>Back to all events</Button>
  )
}
