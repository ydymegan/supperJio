import React from "react"
import { Nav, Navbar } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import './NavBar.css'

export default function NavBar() {

    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
        await logout()
        history.push("/login")
        } catch {
        setError("Failed to log out")
        }
    }

    return (
        <div>
            <Navbar>
                <Nav.Link href="/"><h1 className="navbar-logo">supperJio <i className="fas fa-utensils"></i></h1></Nav.Link>
                <nav className="navbar-items">
                <Nav.Link href="about-us" className="nav-links">About Us</Nav.Link>
                <Nav.Link href="FAQ" className="nav-links">FAQs</Nav.Link>
                <Nav.Link href="contact-us" className="nav-links">Contact Us</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </nav>
            </Navbar>
        </div>
    );
} 
