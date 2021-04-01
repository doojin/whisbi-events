import React from 'react'
import Header from './Header'
import { useDispatch } from 'react-redux'
import { setUser } from './store/slice/user'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Events from './Events'
import { Container } from 'react-bootstrap'

function App () {
  const dispatch = useDispatch()
  const localUser = localStorage.getItem('user')

  if (localUser) {
    dispatch(setUser(JSON.parse(localUser)))
  }

  return (
    <>
      <Header/>
      <BrowserRouter>
        <Container>
          <Switch>
            <Route path="/">
              <Events/>
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default App
