import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import Navbar from './Navbar.js'

export class App extends Component {

  responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
    
    
  }
  render() {
    return (
      <div><center>
        <Navbar />
        <br></br>
        <GoogleLogin
        clientId="218924193577-fcvqjjd7v7ghkvtjh6pm3uk98psu6hnm.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        />
      </center></div>
    )
  }
}

export default App