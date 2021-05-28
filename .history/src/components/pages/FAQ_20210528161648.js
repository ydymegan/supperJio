import React, { useState } from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <Container>
                <div className="wrapper">
                    <div className="accordion">
                        {Data.map((item ,index) => {
                            return (
                                <div className="item">
                                    <div className="title">
                                        <h1>{item.question}</h1>
                                        <span></span>
                                    </div>
                                    <div className="content">{item.answer}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </div>
    );
}