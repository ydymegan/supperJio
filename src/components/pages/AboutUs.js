import React from "react"
import NavBar from '../layout/NavBar.js'
import { Container } from "react-bootstrap"
import './AboutUs.css'

export default function AboutUs() {
    return (
        <div className="page">
            <NavBar></NavBar>
            <Container className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "500px" }}>
                    <h2>About Us</h2>
                </div>
            </Container>  
        </div>
    );
}