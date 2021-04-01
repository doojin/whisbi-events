import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, cleanUser } from './store/slice/user'
import './LogoutButton.css'
import { Button } from 'react-bootstrap'

export default function LogoutButton () {
  const currentUser = useSelector(getUser)
  const dispatch = useDispatch()

  return (
    <div className="LogoutButton">
      <img className="UserAvatar" alt={currentUser.name} src={currentUser.photo}/>
      <div className="UserName">{currentUser.name}</div>
      <Button onClick={() => dispatch(cleanUser())} className="UserLogout">Logout</Button>
    </div>
  )
}
