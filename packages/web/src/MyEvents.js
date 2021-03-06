import React, { useEffect, useState } from 'react'
import whisbiApi from './api/whisbi'
import { useSelector } from 'react-redux'
import { getUserToken } from './store/slice/user'
import { Button, Table } from 'react-bootstrap'
import EventDate from './EventDate'
import BackToEventsButton from './BackToEventsButton'
import { useHistory } from 'react-router-dom'
import notifications from './notifications'

export default function MyEvents () {
  const [events, setEvents] = useState([])
  const token = useSelector(getUserToken)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const userEvents = await whisbiApi.getUserEvents(token)
      setEvents(userEvents)
    })()
  }, [token])

  const editButton = eventId => (
    <Button onClick={() => history.push(`/event/${eventId}/edit`)}>
      Edit
    </Button>
  )

  const deleteButton = eventId => (
    <Button onClick={async () => {
      await whisbiApi.deleteEvent(eventId, token)
      history.push('/')
      notifications.success('Your event was deleted')
    }}>
      Delete
    </Button>
  )

  const rows = events.map(event => (
    <tr key={ event.id }>
      <td># { event.id }</td>
      <td>{ event.headline }</td>
      <td>{ event.state }</td>
      <td><EventDate date={ event.startDate }/></td>
      <td className="text-center">
        { editButton(event.id) } { deleteButton(event.id) }
      </td>
    </tr>
  ))

  return (
    <>
      <div className="Links">
        <BackToEventsButton/>
      </div>

      <Table striped bordered>
        <thead>
        <tr>
          <th># ID</th>
          <th>Headline</th>
          <th>State</th>
          <th>Start Date</th>
          <th className="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        { rows }
        </tbody>
      </Table>
    </>
  )
}
