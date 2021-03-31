import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginButton from './LoginButton'

describe('Login button', () => {
  beforeEach(() => {
    render(<LoginButton/>)
  })

  test('contains login button element', () => {
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Sign in with Google')
  })
})
