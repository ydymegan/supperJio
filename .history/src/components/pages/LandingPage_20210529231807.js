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

    return (
        <div className="page">
            <NavBar></NavBar>
            
            
        </div>
    );
}
