import React from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
{/* <style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');
</style> */}

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <Container>
                {Data.map((item ,index) => {
                    return (
                        <div>
                            <h1>{item.question}</h1>
                            <p>{item.answer}</p>
                        </div>
                    )
                })}
            </Container>
        </div>
    );
}