import React, { useEffect } from 'react'
import Header from './Header'
import { useDispatch, useSelector } from 'react-redux'
import { getUserToken, setUser } from './store/slice/user'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Events from './Events'
import { Container } from 'react-bootstrap'
import './App.css'
import UpsertEventForm from './UpsertEventForm'
import EventDetails from './EventDetails'
import ReactNotification from 'react-notifications-component'
import MyEvents from './MyEvents'
import MySubscriptions from './MySubscriptions'
import notificationApi from './api/notification'

function App () {
  const dispatch = useDispatch()
  const token = useSelector(getUserToken)

  useEffect(() => {
    const localUser = localStorage.getItem('user')

    if (localUser) {
      dispatch(setUser(JSON.parse(localUser)))
    }

    if (token) {
      notificationApi.createConnection(token)
    } else {
      notificationApi.disconnect()
    }
  }, [token])

  return (
    <div className="App">
      <BrowserRouter>
        <ReactNotification/>
        <Header/>
        <Container className="MainContainer">
          <Switch>
            <Route exact path="/">
              <Events/>
            </Route>
            <Route exact path="/event/new">
              <UpsertEventForm/>
            </Route>
            <Route exact path="/event/my">
              <MyEvents/>
            </Route>
            <Route exact path="/event/:id/edit">
              <UpsertEventForm/>
            </Route>
            <Route exact path="/event/:id">
              <EventDetails/>
            </Route>
            <Route exact path="/subscription/my">
              <MySubscriptions/>
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
