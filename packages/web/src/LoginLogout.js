import React from 'react'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { useSelector } from 'react-redux'
import { isAuthenticated } from './store/slice/user'

export default function LoginLogout () {
  const isUserAuthenticated = useSelector(isAuthenticated)
  const Button = isUserAuthenticated ? LogoutButton : LoginButton

  return (
    <div className="float-right">
      <Button/>
    </div>
  )
}
