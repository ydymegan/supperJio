import React, { useState } from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './FaqData.js'
import { Container, Button } from "react-bootstrap"
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
            <Button href="/" className="button">Back to Home</Button>
            <Container style={{ width: "600px", justify: "center" }}>
                    <h2>Frequently Asked Questions</h2>
                    <div className="accordion">
                        {Data.map((item, index) => {
                            return (
                                <div className="item">
                                    <div className="question" onClick={() => toggle(index)}>
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
            </Container>
        </div>
    );
}