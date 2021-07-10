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
    const [loader, setLoader] = useState(false);
    const ref = db.collection("jio");
    const [username, setUsername] = useState("");

    var docRef = db.collection("users").doc(user.email);
    docRef.get().then((doc) => {
        setUsername(doc.data().username);
    });

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

    function filterByUsername(jio) {
        var i;
        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (username === jio.joinerUsernames[i]) {
                return true;
            }
        }
        return false;
    }

    function filterJio() {
        return startAJio.filter(jio => filterByUsername(jio))
    }

    function displayOrders(jio) {
        var i;
        var j;
        let temp = [];
        let output = "";
        for (i = 0; i < jio.orders.length; i++) {
            if (username === jio.joinerUsernames[i]) {
                temp.push(jio.orders[i]);
            }
        }
        for (j = 0; j < temp.length; j++) {
            (j === temp.length - 1) ? output += temp[j] : output += temp[j] + ", ";
        }
        return output;
    }

    const handleSubmit = (e, jio) => {
        e.preventDefault();
        setLoader(true);

        var joinerUsernameArray = [];
        var orderArray = []
        var i;
        var j;
        var idxForOrders = [];
        var k = 0;

        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (jio.joinerUsernames[i] !== username) {
                joinerUsernameArray.push(jio.joinerUsernames[i]);
            } else {
                idxForOrders.push(i);
            }
        }

        for (j = 0; j < jio.orders.length; j++) {
            if (j !== idxForOrders[k]) {
                orderArray.push(jio.orders[j]);
            } else {
                k = (idxForOrders.length !== k + 1) ? k + 1 : k;
            }
        }

        ref.doc(jio.jioID).update({ joinerUsernames: joinerUsernameArray, orders: orderArray }
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
                            <p>Starter: {jio.starterUsername}</p>
                            <p>My Orders: {displayOrders(jio)}</p>
                            <button type="submit"
                                onClick={e => {handleSubmit(e, jio)}}
                                disabled={jio.orderTime.toDate().getTime() <= new Date().getTime()}
                                style={{ background: loader ? "#ccc" : "#bdc1eb" }}
                            >
                                Remove My Order
                            </button>
                        </div>
                    ))}
            </Container>
        </div>
    );
}