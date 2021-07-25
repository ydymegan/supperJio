import React, { useState } from "react"
import { Nav, Navbar, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import './NavBar.css'
import { db } from '../../firebase.js'

export default function NavBar() {

    const userRef = db.collection("users");
    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")
    const [username, setUsername] = useState("");
    const [clicked, setClicked] = useState(false);
    const history = useHistory();

    var docRef = userRef.doc(currentUser.email);
    docRef.get().then((doc) => {
        setUsername(doc.data().username);
    });

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    return (
        <div>
            <Navbar>
                <Nav.Link href="/"><h1 className="navbar-logo">supperJio <i className="fas fa-utensils"></i></h1></Nav.Link>
                <div className="menu-icon" onClick={() => setClicked(!clicked)}>
                    <div className={(clicked) ? 'fas fa-times' : 'fas fa-bars'}></div>
                </div>
                <nav className={(clicked) ? 'navbar-items active' : 'navbar-items'}>
                    <Nav.Link href="about-us" className="nav-links">About Us</Nav.Link>
                    <Nav.Link href="FAQ" className="nav-links">FAQs</Nav.Link>
                    <Nav.Link href="contact-us" className="nav-links">Contact Us</Nav.Link>
                    <Nav.Link href="profile" className="nav-links">Profile</Nav.Link>
                    <Nav.Link href="update-profile" className="nav-links">Update Profile</Nav.Link>
                    <Nav.Link className="nav-links" onClick={handleLogout}>Logout from {username}</Nav.Link>
                    {error && <Alert variant="danger">{error}</Alert>}
                </nav>
            </Navbar>
        </div>
    );
}
