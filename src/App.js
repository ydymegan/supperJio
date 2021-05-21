import React, { Component } from 'react';
import Login from "./Login.js";
import Home from "./Home.js";
import AboutUs from "./AboutUs.js";
import Contact from "./Contact.js";
import FAQ from "./FAQ.js";
import StartAJio from "./StartAJio.js";
import JoinAJio from "./JoinAJio.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


export class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
    });
  }

  handleLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN",
    });
  }

  render() {
    return (
      <div>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/aboutus" component={AboutUs} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/faq" component={FAQ} />
          <Route exact path="/startajio" component={StartAJio} />
          <Route exact path="/joinajio" component={JoinAJio} />
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App