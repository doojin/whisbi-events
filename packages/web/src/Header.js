import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import Logo from './Logo'
import LoginButton from './LoginButton'
import './Header.css'

export default function Header () {
  return (
    <Navbar className="Header">
      <Container>
        <Logo/>
        <LoginButton/>
      </Container>
    </Navbar>
  )
}
