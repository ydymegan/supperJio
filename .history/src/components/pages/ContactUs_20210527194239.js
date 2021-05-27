import React, { useState } from "react"
import { db } from '../../firebase.js'
import NavBar from '../layout/NavBar.js'

export default function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        db.collection('contacts').add({
            name:name,
            email:email,
            message:message,
        })
        .then(() => {
            alert('Your message has been submitted!')
        })
        .catch(error => {
            alert(error.message);
        })
    };

    return (
        <div>
        <NavBar></NavBar>
        
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

            <button type="submit">Submit</button>
            
        </form>
        </div>
    );
}