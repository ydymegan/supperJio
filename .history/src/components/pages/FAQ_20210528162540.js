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
        <div>
        <NavBar></NavBar>
            <Container>
                <div className="wrapper">
                    <div className="accordion">
                        {Data.map((item ,index) => {
                            return (
                                <div className="item">
                                    <div className="title" onClick={() => toggle(index)}>
                                        <h1>{item.question}</h1>
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