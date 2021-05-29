// import React from "react"
// import { Button } from "react-bootstrap"
// import { useAuth } from "../../contexts/AuthContext"
// // import { Link, useHistory } from "react-router-dom"
// import NavBar from "../layout/NavBar"
// import './LandingPage.css'

// export default function LandingPage() {
//  // const { currentUser, logout } = useAuth()
//   /*const [error, setError] = useState("")
//   const { currentUser, logout } = useAuth()
//   const history = useHistory()

//   async function handleLogout() {
//     setError("")

//     try {
//       await logout()
//       history.push("/login")
//     } catch {
//       setError("Failed to log out")
//     }
//   }*/

//   return ( 
//     <div className="page">
//       <NavBar></NavBar>
//     </div>
//   );
// }

import React, { useState } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
//import './LandingPage.css'

export default function LandingPage() {
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
        <div className="page">
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
