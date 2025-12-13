import { render, screen } from '@testing-library/react'
import HelloWorld from '../HelloWorld'

describe('HelloWorld Component', () => {
  test('renders default greeting', () => {
    render(<HelloWorld />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })

  test('renders custom name', () => {
    render(<HelloWorld name="React" />)
    expect(screen.getByText('Hello, React!')).toBeInTheDocument()
  })
})
