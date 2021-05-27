import React from "react"
import Signup from "./components/auth/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LandingPage from "./components//landingpage/LandingPage"
import Login from "./components/auth/Login"
import PrivateRoute from "./components/routing/PrivateRoute"
import ForgotPassword from "./components/auth/ForgotPassword"
import UpdateProfile from "./components/UpdateProfile"

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={LandingPage} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App
