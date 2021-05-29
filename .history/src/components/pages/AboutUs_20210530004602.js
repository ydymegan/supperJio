import React from "react"
import NavBar from '../layout/NavBar.js'
import { Container } from "react-bootstrap"

export default function AboutUs() {
    return (
        <div>
            <NavBar></NavBar>
            <Container className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "1000px" }}>
                    <h1>About Us</h1>
                </div>
        </Container>  
        </div>
    );
}