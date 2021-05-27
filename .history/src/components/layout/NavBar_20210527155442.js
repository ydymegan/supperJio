import React from "react"
import { Navbar, NavbarBrand } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.css'

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
