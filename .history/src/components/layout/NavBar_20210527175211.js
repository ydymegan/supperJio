import React from "react"
import { Nav, Navbar } from "react-bootstrap"
import './NavBar.css'

export default function NavBar() {


    return (
        <div>
            <Navbar>
            <h1 className="navbar-logo">supperJio <i className="fas fa-utensils"></i></h1>
            <Nav.Link href="about-us">About Us</Nav.Link>
            <Nav.Link href="FAQ">FAQs</Nav.Link>
            <Nav.Link href="contact-us">Contact Us</Nav.Link>
            </Navbar>
        </div>
    );
} 
