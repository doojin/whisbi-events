import React, { useEffect, useState } from 'react'
import whisbiApi from './api/whisbi'
import { useSelector } from 'react-redux'
import { getUserToken } from './store/slice/user'
import { Button, Table } from 'react-bootstrap'
import EventDate from './EventDate'
import BackToEventsButton from './BackToEventsButton'

export default function MyEvents () {
  const [events, setEvents] = useState([])
  const token = useSelector(getUserToken)

  useEffect(() => {
    (async () => {
      const userEvents = await whisbiApi.getUserEvents(token)
      setEvents(userEvents)
    })()
  }, [token])

  const rows = events.map(event => (
    <tr key={ event.id }>
      <td># { event.id }</td>
      <td>{ event.headline }</td>
      <td>{ event.state }</td>
      <td><EventDate date={ event.startDate }/></td>
      <td className="text-center">
        <Button>Edit</Button>
        {' '}<Button>Delete</Button>
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
