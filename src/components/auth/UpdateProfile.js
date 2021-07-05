import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from '../../firebase.js'

export default function UpdateProfile() {
  const emailRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const ref = db.collection("users");
  const [username, setUsername] = useState("");

  var docRef = ref.doc(currentUser.email);
  docRef.get().then((doc) => {
    setUsername(doc.data().username);
  });

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (usernameRef.current.value && usernameRef.current.value !== ref.doc(currentUser.email)) {
      ref.doc(currentUser.email).update({
        username: usernameRef.current.value,
      })
    }
    if (passwordRef.current.value) {
      ref.doc(currentUser.email).update({
        password: passwordRef.current.value,
      })
      promises.push(updatePassword(passwordRef.current.value))
    }
    if (emailRef.current.value !== currentUser.email) {
      ref.doc(currentUser.email).update({
        email: emailRef.current.value,
      })
      ref.doc(currentUser.email).get().then(function (doc) {
        if (doc && doc.exists) {
          var data = doc.data();
          ref.doc(emailRef.current.value).set(data);
          ref.doc(currentUser.email).delete();
        }
      });
      promises.push(updateEmail(emailRef.current.value))
    }


    Promise.all(promises)
      .then(() => {
        history.push("/login")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  defaultValue={currentUser.email}
                />
              </Form.Group>
              <Form.Group id="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  ref={usernameRef}
                  required
                  defaultValue={username}
                />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link to="/">Cancel</Link>
        </div>
      </div>
    </Container>
  )
}
