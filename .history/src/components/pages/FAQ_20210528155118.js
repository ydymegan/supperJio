import React from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import { Container } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <section id="faqs">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 offset-lg-2">
                            <h1>Frequently Asked Questions (FAQ)</h1>
                            <div class="accordion" id="accordionSection">
                                <div class="accordion-item mb-3">
                                    <h2 class="accordion-header">
                                        <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne">Item 1</button></h2>
                                    <div class="accordion-collapse collapse" id="collapseOne" data-bs-parent="#accordionSection">
                                        <div class="accordion-body">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br></br>
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