import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import Logo from './Logo'
import './Header.css'
import LoginLogout from './LoginLogout'

export default function Header () {
  return (
    <Navbar className="Header">
      <Container>
        <Logo/>
        <LoginLogout/>
      </Container>
    </Navbar>
  )
}
