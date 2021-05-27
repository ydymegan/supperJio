import React, { useState } from "react"
import { db } from '../../firebase.js'
import NavBar from '../layout/NavBar.js'
import './ContactUs.css'

export default function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const[loader, setLoader] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        db.collection('contacts').add({
            name:name,
            email:email,
            message:message,
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
        setEmail("");
        setMessage("");
    };

    return (
        <div>
        <NavBar></NavBar>
        
        <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
        <form className="form" onSubmit=
        {handleSubmit}>
            <h1>Contact Us Here!</h1>

            <label>Name</label>
            <input 
                placeholder="name" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
            />

            <label>Email</label>
            <input 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />

            <label>Message</label>
            <input 
                placeholder="Message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
            />

            <button type="submit" style={{background : loader
            ? "#ccc" : "#5C65CF"}}
            >
                Submit
            </button>
            
        </form>
        </div>
        </Container>
        </div>
    );
}