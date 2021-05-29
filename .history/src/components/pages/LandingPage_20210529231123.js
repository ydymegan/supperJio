import React from "react"
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
      <br></br>
    </div>
  );
}
