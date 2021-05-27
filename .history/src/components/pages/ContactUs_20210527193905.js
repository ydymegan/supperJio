import React, { useState } from "react"
import { db } from '../../firebase.js'
import NavBar from '../layout/NavBar.js'

export default function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div>
        <NavBar></NavBar>
        
        <form className="form">
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
            <textarea placeholder="Message"></textarea>

            <button type="submit">Submit</button>
            
        </form>
        </div>
    );
}