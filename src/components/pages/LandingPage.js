import React, { useState } from "react"
import { Button, Container } from "react-bootstrap"
import NavBar from "../layout/NavBar"
import './LandingPage.css'
import firebase from "firebase/app";
import { db } from '../../firebase.js'

export default function LandingPage() {
  var user = firebase.auth().currentUser;

  const [username, setUsername] = useState("");

  var docRef = db.collection("users").doc(user.email);
  docRef.get().then((doc) => {
    setUsername(doc.data().username);
  });

  return (
    <div className="page">
      <NavBar></NavBar>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "1000px" }}>
          <h2>Welcome {username}!</h2>
          <div className="buttons">
            <Button href="/start-a-jio" style={{ padding: "20px" }} variant="outline-primary">Start A Jio</Button>{' '}
            <Button href="/join-a-jio" style={{ padding: "20px" }} variant="outline-primary">Join A Jio</Button>{' '}
            <Button href="/my-started-jio" style={{ padding: "20px" }} variant="outline-primary">My Started Jio</Button>{' '}
            <Button href="/my-joined-jio" style={{ padding: "20px" }} variant="outline-primary">My Joined Jio</Button>{' '}
            {/* <Button href="/review" style={{ padding: "20px" }} variant="outline-primary">Review</Button>{' '} */}
          </div>
        </div>
      </Container>
    </div>
  );
}


