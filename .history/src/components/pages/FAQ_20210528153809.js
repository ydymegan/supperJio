import React from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import { Container } from "react-bootstrap"


/* <style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Coiny&display=swap');
</style> */

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <Container>
                <div class="row">
                    <div class="col-lg-8 offset-lg-2">
                        <h1>Frequently Asked Questions (FAQ)</h1>
                        <div class="accordion mt-5" id="accordionExample">
                            <div class="card">
                                <div class="card-header" id="headingOne">
                                    <h2 class="clearfix mb-0">
                                        <a class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                                        aria-controls="collapseOne">HOW CAN I CONTACT YOU? <i class="fa fa-angle-down"></i></a>
                                    </h2>
                                </div>
                                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div class="card-body">
                                        ANSWER IS HERE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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