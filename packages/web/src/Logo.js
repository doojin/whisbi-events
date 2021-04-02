import React from 'react'
import './Logo.css'
import { useHistory } from 'react-router-dom'

export default function Logo () {
  const history = useHistory()

  return (
    <h1 className="Logo" onClick={() => history.push('/')}>
      Whisbi Events
    </h1>
  )
}
