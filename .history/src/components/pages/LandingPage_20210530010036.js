import React from "react"
import { Button, Container } from "react-bootstrap"
import NavBar from "../layout/NavBar"
import './LandingPage.css'
import firebase from "firebase/app";

export default function LandingPage() {

  let user = firebase.auth().currentUser

  return ( 
    <div className="page">
      <NavBar></NavBar>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h2>Welcome {user.email}!</h2>
            <div className="buttons">
              <Button style={{padding: "20px"}} variant="outline-primary">Start A Jio</Button>{' '}
              <Button style={{padding: "20px"}} variant="outline-primary">Join A Jio</Button>{' '}
            </div>   
          </div>
      </Container>     
    </div>
  );
}
