import React, { useState } from "react"
import { Nav, Navbar, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import './NavBar.css'

export default function NavBar() {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
        await logout()
        history.push("/")
        } catch {
        setError("Failed to log out")
        }
    }

    return (
        <div>
            <Navbar>
                <Nav.Link href="/"><h1 className="navbar-logo">supperJio <i className="fas fa-utensils"></i></h1></Nav.Link>
                <nav className="navbar-items">
                <Nav.Link href="/" className="nav-links">Home</Nav.Link>
                <Nav.Link href="about-us" className="nav-links">About Us</Nav.Link>
                <Nav.Link href="FAQ" className="nav-links">FAQs</Nav.Link>
                <Nav.Link href="contact-us" className="nav-links">Contact Us</Nav.Link>
                <Nav.Link href="update-profile" className="nav-links">Update Profile</Nav.Link>
                <Nav.Link className="nav-links" onClick={handleLogout}>Logout from {currentUser.email}</Nav.Link>
                {error && <Alert variant="danger">{error}</Alert>}
                </nav>
            </Navbar>
        </div>
    );
} 
