import React, { useState } from "react"
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './ContactUs.css'
import firebase from "firebase/app";

export default function ContactUs() {
    var user = firebase.auth().currentUser;

    const [name, setName] = useState("");
    const [queryType, setQueryType] = useState("");
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        db.collection('contacts').add({
            name: name,
            email: user.email,
            queryType: queryType,
            message: message,
        })
            .then(() => {
                alert('Your message has been submitted!')
                setLoader(false);
            })
            .catch(error => {
                alert(error.message);
                setLoader(false);
            });

        setName("");
        setQueryType("");
        setMessage("");
    };

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form" onSubmit=
                        {handleSubmit}>
                        <h1>Contact Us Here!</h1>

                        <label>Name</label>
                        <input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Query Type</label>
                        <input
                            placeholder="Query Type"
                            value={queryType}
                            onChange={(e) => setQueryType(e.target.value)}
                        />

                        <label>Message</label>
                        <input
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <button type="submit" style={{
                            background: loader
                                ? "#ccc" : "#5C65CF"
                        }}
                        >
                            Submit
                        </button>

                    </form>
                </div>
            </Container>
        </div>
    );
}