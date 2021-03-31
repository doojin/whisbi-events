import React from 'react'
import { render, screen } from '@testing-library/react'
import Logo from './Logo'

describe('Logo', () => {
  beforeEach(() => render(<Logo/>))

  test('contains project name', () => {
    expect(screen.getByText('Whisbi Events')).toBeInTheDocument()
  })
})
