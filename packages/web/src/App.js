import React from 'react'
import Header from './Header'
import { useDispatch } from 'react-redux'
import { setUser } from './store/slice/user'

function App () {
  const dispatch = useDispatch()
  const localUser = localStorage.getItem('user')

  if (localUser) {
    dispatch(setUser(JSON.parse(localUser)))
  }

  return (
    <>
      <Header/>
    </>
  )
}

export default App
