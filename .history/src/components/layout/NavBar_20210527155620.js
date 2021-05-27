import React from "react"
import { Navbar } from "react-bootstrap"
import './NavBar.css'

export default function NavBar() {


    return (
        <div className="navbar">
            <Navbar bg="red" variant="dark">
                <Navbar.Brand>
                    Logo
                </Navbar.Brand>
            </Navbar>
        </div> 
    );
} 
