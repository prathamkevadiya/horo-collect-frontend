'use client'
// import node module libraries
import { Container } from 'react-bootstrap';

export default function AuthLayout({ children }) {
  return (
    <Container className="auth-bg d-flex flex-column">  
        {children}
    </Container>
  )
}
