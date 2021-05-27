import React from "react"
import Signup from "./components/auth/Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LandingPage from "./components//landingpage/LandingPage"
import Login from "./components/auth/Login"
import PrivateRoute from "./components/routing/PrivateRoute"
import ForgotPassword from "./components/auth/ForgotPassword"
import UpdateProfile from "./components/auth/UpdateProfile"

function App() {
  return (
    <div>
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
    </div>
  )
}

export default App
