import React from 'react'
import Header from './Header'
import { useDispatch } from 'react-redux'
import { setUser } from './store/slice/user'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Events from './Events'
import { Container } from 'react-bootstrap'
import './App.css'
import NewEventForm from './NewEventForm'

function App () {
  const dispatch = useDispatch()
  const localUser = localStorage.getItem('user')

  if (localUser) {
    dispatch(setUser(JSON.parse(localUser)))
  }

  return (
    <div className="App">
      <Header/>
      <BrowserRouter>
        <Container className="MainContainer">
          <Switch>
            <Route exact path="/">
              <Events/>
            </Route>
            <Route exact path="/event/new">
              <NewEventForm/>
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
