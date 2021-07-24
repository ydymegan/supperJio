import React, { useState } from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from '../../data/FaqData.js'
import { Container, Button } from "react-bootstrap"
import './FAQ.css'
import { useHistory } from 'react-router-dom'

export default function FAQ() {
    let history = useHistory();

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
            <Button onClick={history.goBack} className="button">Back</Button>
            <Container style={{ width: "600px", justify: "center" }}>
                <div className="head">Frequently Asked Questions</div>
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