import React from "react"
import { Button, Container } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import NavBar from "../layout/NavBar"
import './LandingPage.css'

export default function LandingPage() {
  const { currentUser, setCurrentUser } = useAuth()

  return ( 
    <div className="page">
      <NavBar></NavBar>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h1>Welcome {currentUser.email}!</h1>
            <div className="buttons">
              <Button style={{padding: "20px"}} variant="outline-primary">Start A Jio</Button>{' '}
              <Button style={{padding: "20px"}} variant="outline-primary">Join A Jio</Button>{' '}
            </div>   
          </div>
      </Container>     
    </div>
  );
}
