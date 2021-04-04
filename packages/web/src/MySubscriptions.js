import React, { useEffect, useState } from 'react'
import whisbiApi from './api/whisbi'
import { useSelector } from 'react-redux'
import { getUserToken } from './store/slice/user'
import { Button, Table } from 'react-bootstrap'
import EventDate from './EventDate'
import BackToEventsButton from './BackToEventsButton'
import { useHistory } from 'react-router-dom'
import notifications from './notifications'

export default function MySubscriptions () {
  const [subscriptions, setSubscriptions] = useState([])
  const token = useSelector(getUserToken)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const userSubscriptions = await whisbiApi.getUserSubscriptions(token)
      setSubscriptions(userSubscriptions)
    })()
  }, [token])

  const unusbscribeButton = subscriptionId => (
    <Button onClick={async () => {
      await whisbiApi.deleteSubscription(subscriptionId, token)
      history.go(0)
      notifications.success('You have been unsubscribed from event')
    }}>
      Unusbscribe
    </Button>
  )

  const rows = subscriptions.map(subscription => (
    <tr key={ subscription.id }>
      <td>{ subscription.event.headline }</td>
      <td>{ subscription.event.state }</td>
      <td><EventDate date={ subscription.event.startDate }/></td>
      <td className="text-center">
        { unusbscribeButton(subscription.id) }
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
          <th>Event Headline</th>
          <th>Event State</th>
          <th>Event Start Date</th>
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
