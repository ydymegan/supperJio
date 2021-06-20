import React from "react"
import NavBar from '../layout/NavBar.js'
import { Container } from "react-bootstrap"
import { Link } from "react-bootstrap"
import './AboutUs.css'

export default function AboutUs() {
    return (
        <div className="page">
            <NavBar></NavBar>
            <Link to="/"><button>Back to Home</button></Link>
            <Container className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "600px" }}>
                    <h2>About Us</h2>
                        <p>Despite living in a densely populated city, many of us are unable to find 
                        nearby friends or neighbours to share hefty delivery costs to satisfy our 
                        cravings.</p>

                        <p>Here at supperJio, we aim to provide a platform that consolidates food delivery 
                        orders amongst residents in your vicinity. By using our platform, not only do you 
                        save on delivery charges, but our collective carbon footprint will also be reduced 
                        as fewer trips are made by delivery riders.</p>
                </div>
            </Container>  
        </div>
    );
}