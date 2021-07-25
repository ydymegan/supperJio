import React, { useState } from "react"
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './ContactUs.css'
import firebase from "firebase/app";
import { useHistory } from 'react-router-dom'

export default function ContactUs() {
    var user = firebase.auth().currentUser;

    const contactRef = db.collection('contacts')
    const [name, setName] = useState("");
    const [queryType, setQueryType] = useState("");
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);
    let history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        contactRef.add({
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
            <Button onClick={history.goBack} className="button">Back</Button>
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
                            required
                        />

                        <label>Subject</label>
                        <input
                            placeholder="Query Type"
                            value={queryType}
                            onChange={(e) => setQueryType(e.target.value)}
                            required
                        />

                        <label>Message</label>
                        <input
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
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