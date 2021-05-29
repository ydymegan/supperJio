import React from "react"
import styled from 'styled-components'
import { Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
// import { Link, useHistory } from "react-router-dom"
import NavBar from "../layout/NavBar"
import './LandingPage.css'

export default function LandingPage() {
  const { currentUser, logout } = useAuth()
  /*const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }*/

  return ( 
    <div className="body">
      <NavBar></NavBar>
      <div className="title">
        Welcome {currentUser.email}!
      </div>

      {/* <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
    </Container> */}
    </div>
  )
}
