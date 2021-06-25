import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyJoinedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function MyJoinedJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");
    const [loader, setLoader] = useState(false);
    const ref = db.collection("jio");

    function getJio() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setStartAJio(items);
            setLoading(false);
        });
    }

    useEffect(() => {
        getJio();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    function filterByID(jio) {
        var i;
        for (i = 0; i < jio.joinerID.length; i++) {
            if (user.uid === jio.joinerID[i]) {
                return true;
            }
        }
        return false;
    }

    function filterJio() {
        return startAJio.filter(jio => filterByID(jio))
    }

    function displayOrders(jio) {
        var i;
        var j;
        let temp = [];
        let output = "";
        for (i = 0; i < jio.order.length; i++) {
            if (user.uid === jio.joinerID[i]) {
                temp.push(jio.order[i]);
            }
        }
        for (j = 0; j < temp.length; j++) {
            (j === temp.length - 1) ? output += temp[j] : output += temp[j] + ", ";
        }
        return output;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        var joinerIDArray = [];
        var orderArray = []
        var i;
        var j;
        var idxForOrders = [];
        var k = 0;

        for (i = 0; i < selectedJio.joinerID.length; i++) {
            if (selectedJio.joinerID[i] !== user.uid) {
                joinerIDArray.push(selectedJio.joinerID[i]);
            } else {
                idxForOrders.push(i);
            }
        }

        for (j = 0; j < selectedJio.order.length; j++) {
            if (j !== idxForOrders[k]) {
                orderArray.push(selectedJio.order[j]);
            } else {
                k = (idxForOrders.length !== k + 1) ? k + 1 : k;
            }
        }

        ref.doc(selectedJio.jioID).update({ joinerID: joinerIDArray, order: orderArray }
        )
            .then(() => {
                alert('You have successfully removed your order!')
                setLoader(false);
            })
            .catch(error => {
                alert(error.message);
                setLoader(false);
            });
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <div className="title">My Joined Jio</div>
            <Container style={{ width: "600px", justify: "center" }}>
                {filterJio()
                    .map((jio) => (
                        <div key={jio.id} className="jio">
                            <h2>{jio.foodStore}</h2>
                            <p>Delivery App: {jio.deliveryApp}</p>
                            <p>Region: {jio.region.label}</p>
                            <p>Collection Point: {jio.collectionPoint}</p>
                            <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <p>Order Status: {jio.orderStatus}</p>
                            <p>My Orders: {displayOrders(jio)}</p>
                            <input placeholder="Type Yes, Click Remove" onChange={e => setSelectedJio(jio)}></input>
                            <br /><br />
                            <button type="submit" 
                                onClick={handleSubmit} 
                                disabled={jio.orderTime.toDate().getTime() <= new Date().getTime()}
                                // style={{background: loader ? "#ccc" : "#bdc1eb"}}
                                >
                                    Remove My Order
                            </button>
                        </div>
                    ))}
            </Container>
        </div>
    );
}