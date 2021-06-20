import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function MyJoinedJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");

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

    function getAvailableJio(jio) {
        return jio.orderTime.toDate().getTime() >= new Date().getTime();
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

    const removeOrder = () => {
        var joinerIDArray = [];
        var orderArray= []
        var i;
        var j;
        var idx;

        for (i = 0; i < selectedJio.joinerID.length; i++) {
            if (selectedJio.joinerID[i] !== user.uid) {
                joinerIDArray.push(selectedJio.joinerID[i]);
                console.log("i'm here")
            } else {
                idx = i;
            }
        }

        for (j = 0; j < selectedJio.order.length; j++) {
            if (j !== idx) {
                orderArray.push(selectedJio.order[j]);
            }
        }

        ref.doc(selectedJio.jioID).update({joinerID: joinerIDArray, order: orderArray}
            )
            .then(() => {
                alert('You have successfully removed your order!')
            })
            .catch(error => {
                alert(error.message);
            });
    }
    
    useEffect(() => {
        getJio();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form">
                        {removeOrder}
                        <h1>My Joined Jio</h1>
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
                                    <button type="submit">Remove My Order</button>
                                </div>
                            ))}
                    </form>
                </div>
            </Container>
        </div>
    );
}