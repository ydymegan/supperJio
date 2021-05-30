import React, { useState } from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import { Container } from "react-bootstrap"
import './FAQ.css'

export default function FAQ() {

    const [selected, setSelected] = useState(null)

    const toggle = index => {
        if (selected === index) {
            return setSelected(null)
        } 

        setSelected(index)
    }

    return (
        <div className="body">
            <NavBar></NavBar>
            
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                    <div className="w-100" style={{ maxWidth: "600px" }}>
                        <h2>Frequently Asked Questions</h2>
                        <div className="accordion">
                            {Data.map((item ,index) => {
                                return (
                                    <div className="item">
                                        <div className="title" onClick={() => toggle(index)}>
                                            {item.question}
                                            <span>{selected === index ? '-' : '+'}</span>
                                        </div>
                                        <div className={selected === index ? 'content-show' : 'content'}>
                                            {item.answer}
                                        </div>
                                    </div> 
                                )
                            })}
                        </div>
                    </div>
            </Container>
        </div>
    );
}