import React, { Component } from "react";
import { Link } from 'react-router-dom';

export class Home extends Component {

    responseGoogle=(response)=>{
        console.log(response);
        console.log(response.profileObj);
    }

    render() {
        return (
            <div><center>
                <Link to="/startajio" className="btn btn-primary">Start A Jio</Link>
                <Link to="/joinajio" className="btn btn-primary">Join A Jio</Link>
                <Link to="/login" className="btn btn-primary">Logout</Link>
            </center></div>
        )
    }

}
export default Home;