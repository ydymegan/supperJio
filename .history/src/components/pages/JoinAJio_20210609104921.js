import React, { useState } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'


export default function JoinAJio() {
    

    return (
        <div className="page">
            <NavBar></NavBar>
            
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    
                </div>
            </Container>
        </div>
    );
}