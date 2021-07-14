import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function Review() {
    var user = firebase.auth().currentUser;

    const jioRef = db.collection("jio");
    const userRef = db.collection("users");
    const storageRef = storage.ref("receipts");
    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");
    const [image, setImage] = useState(null);
    const [notif, setNotif] = useState("");
    const [username, setUsername] = useState("");


    var docRef = userRef.doc(user.email);
    docRef.get().then((doc) => {
        setUsername(doc.data().username);
    });

    function getJio() {
        setLoading(true);
        jioRef.onSnapshot((querySnapshot) => {
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
        return username === jio.starterUsername;
    }

    function filterJio() {
        return startAJio.filter(jio => filterByUsername(jio))
    }

    function displayOrders(jio) {
        if (jio.starterUsername === username) {
            var i;
            let output = "";
            for (i = 0; i < jio.orders.length; i++) {
                (i === jio.orders.length - 1) ? output += jio.orders[i] : output += jio.orders[i] + ", ";
            }
            return output;
        }
    }

    function displayJoinerUsernames(jio) {
        if (jio.starterUsername === username) {
            var i;
            let output = "";
            for (i = 0; i < jio.joinerUsernames.length; i++) {
                (i === jio.joinerUsernames.length - 1) ? output += jio.joinerUsernames[i] : output += jio.joinerUsernames[i] + ", ";
            }
            return output;
        }
    }

    function updateURL(url) {
        jioRef.doc(selectedJio.jioID).update({ receiptURL: url });
    }

    function updateStatus(message) {
        jioRef.doc(selectedJio.jioID).update({ orderStatus: message });
    }

    function submit(event) {
        event.preventDefault();

        if (image === null) {
            alert("Error: No File Uploaded");
        } else if (selectedJio.orderTime.toDate().getTime() > new Date().getTime()) {
            alert("Error: You cannot place an order before the Order Time");
        } else {
            return handleUpload(event);
        }
    }

    function notifyUsers(event) {
        event.preventDefault();

        if (selectedJio.receiptURL === "") {
            alert("Error: Unable to Notify Users as you have not uploaded the order receipt");
        } else if (notif.toUpperCase() !== "YES") {
            alert("Error: Unable to Notify Users as input is not a 'Yes'");
        } else {
            return updateOrder(event);
        }
    }

    const updateOrder = () => {
        jioRef.doc(selectedJio.jioID).update({
            orderStatus: "Ready to Collect"
        })
            .then(() => {
                alert('You have successfully notified the users!')
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const handleUpload = () => {
        const uploadTask = storageRef.child(`${selectedJio.jioID}.receipt`).put(image);
        uploadTask.on(
            "state_changed",
            () => {
                storageRef
                    .child(`${selectedJio.jioID}.receipt`)
                    .getDownloadURL()
                    .then(url => {
                        updateURL(url);
                        updateStatus("Orders Placed");
                        alert('You have uploaded your receipt!');
                    })
                // .catch(error => {
                //     alert(error.message);
                // });
            },
            error => {
                console.log(error);
            }
        )

        //setSelectedJio("");
    };

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <h1>My Started Jio</h1>
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
                            <p>Joiners: {displayJoinerUsernames(jio)}</p>
                            <p>Orders: {displayOrders(jio)}</p>
                            <p>Receipt URL: {jio.receiptURL} </p>
                            <input type="file" onChange={e => { setImage(e.target.files[0]); setSelectedJio(jio); }} required />
                            <button onClick={submit}>Upload Receipt</button>
                            <br /><br />
                            <input type="text" placeholder="Type Yes, Click Notify" onChange={e => { setNotif(e.target.value); setSelectedJio(jio) }} required></input>
                            <br /><br />
                            <button onClick={notifyUsers}>Notify Users Now</button>
                            <br />
                        </div>
                    ))
                }
                <br />
            </Container>
        </div>
    );
}