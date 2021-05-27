import React from "react"
import { Nav, Navbar } from "react-bootstrap"
import './NavBar.css'

export default function NavBar() {


    return (
        <div>
            <Navbar>
                <h1 className="navbar-logo">supperJio <i className="fas fa-utensils"></i></h1>
                <nav className="navbar-items">
                <Nav.Link href="about-us" className="nav-links">About Us</Nav.Link>
                <Nav.Link href="FAQ" className="nav-links">FAQs</Nav.Link>
                <Nav.Link href="contact-us" className="nav-links">Contact Us</Nav.Link>
                </nav>
            </Navbar>
        </div>
    );
} 
