import React from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import Accordion from "./Accordion"
import { Container } from "react-bootstrap"

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <Container>
                
                {Data.map((item ,index) => {
                    return (
                        <div>
                            <Accordion
                                title={item.question}
                                content={item.answer}
                            />
                        </div>
                    )
                })}
            </Container>
        </div>
    );
}