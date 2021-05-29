import React from "react"
import { Container } from "react-bootstrap"
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
    <div className="page">
      <NavBar></NavBar>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "500px" }}>
            <h1>Welcome {currentUser.email}!</h1>
          </div>

      </Container>
    </div>
  );
}
