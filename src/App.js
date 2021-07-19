import React from "react"
import Signup from "./components/auth/Signup"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LandingPage from "./components/pages/LandingPage"
import FAQ from "./components/pages/FAQ"
import AboutUs from "./components/pages/AboutUs"
import ContactUs from "./components/pages/ContactUs"
import Login from "./components/auth/Login"
import PrivateRoute from "./components/routing/PrivateRoute"
import ForgotPassword from "./components/auth/ForgotPassword"
import UpdateProfile from "./components/auth/UpdateProfile"
import StartAJio from "./components/pages/StartAJio"
import JoinAJio from "./components/pages/JoinAJio"
import MyStartedJio from "./components/pages/MyStartedJio"
import MyJoinedJio from "./components/pages/MyJoinedJio"
import Profile from "./components/pages/Profile"
import User from "./components/pages/User"

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={LandingPage} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <PrivateRoute path="/FAQ" component={FAQ} />
            <PrivateRoute path="/about-us" component={AboutUs} />
            <PrivateRoute path="/contact-us" component={ContactUs} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/join-a-jio" component={JoinAJio} />
            <PrivateRoute path="/start-a-jio" component={StartAJio} />
            <PrivateRoute path="/my-started-jio" component={MyStartedJio} />
            <PrivateRoute path="/my-joined-jio" component={MyJoinedJio} />
            <PrivateRoute path="/user/:name" ><User /></PrivateRoute>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
