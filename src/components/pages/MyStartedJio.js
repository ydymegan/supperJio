import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";

export default function MyStartedJio() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");
    const [image, setImage] = useState(null);
    // eslint-disable-next-line
    const [url, setUrl] = useState("");
    const ref = db.collection("jio");
    const storageRef = storage.ref("receipts");
    const [username, setUsername] = useState("");
    const [removeUser, setRemoveUser] = useState("");

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
                output += jio.joinerUsernames[i] + ": " + jio.orders[i];
                output += (i === jio.orders.length - 1) ? "" : ", ";
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
        ref.doc(selectedJio.jioID).update({ receiptURL: url });
    }

    function updateStatus(message) {
        ref.doc(selectedJio.jioID).update({ orderStatus: message });
    }

    async function notifyUsers(event, jio) {
        event.preventDefault();

        if (jio.receiptURL === "") {
            alert("Error: Unable to Notify Users as you have not uploaded the order receipt");
        } else if (jio.orderStatus === "Ready to Collect") {
            alert("Users have been notified!")
        } else {
            return updateOrder(jio);
        }
    }

    function remove(event, jio) {
        event.preventDefault();
        var i;

        if (removeUser === "") {
            alert("Error: No username has been input");
        } else {
            for (i = 0; i < jio.joinerUsernames.length; i++) {
                if (jio.joinerUsernames[i] === removeUser) {
                    return removeUserAndOrder(event, jio);
                }
            }

            if (i === jio.joinerUsernames.length) {
                alert("Error: No Such Username" + removeUser);
            }

        }
    }

    function getUsernames(jio) {
        var i;
        let options = [{ value: "", label: "" }];
        for (i = 0; i < jio.joinerUsernames.length; i++) {
            options.push({ value: i, label: jio.joinerUsernames[i] });
        }
        return options;
    }

    function viewReceipt(e, jio) {
        e.preventDefault();

        if (jio.receiptURL === "") {
            alert("Receipt has not been uploaded!");
        } else {
            return window.open(jio.receiptURL, "_blank");
        }
    }

    const handleRemoveUser = (selectedOption) => {
        setRemoveUser(selectedOption.label);
    };

    const removeUserAndOrder = (e, jio) => {
        e.preventDefault();

        var joinerUsernameArray = [];
        var orderArray = []
        var i;
        var j;
        var idxForOrders = [];
        var k = 0;

        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (jio.joinerUsernames[i] !== removeUser) {
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
                alert('You have successfully removed the user!')
            })
            .catch(error => {
                alert(error.message);
            });

    };

    const updateOrder = (jio) => {
        ref.doc(jio.jioID).update({
            orderStatus: "Ready to Collect"
        })
            .then(() => {
                alert('You have successfully notified the users!')
            })
            .catch(error => {
                alert(error.message);
            });
    };

    async function handleUpload(e, jio) {
        e.preventDefault();

        if (image === null) {
            alert("Error: No File Uploaded");
        } else if (jio.orderTime.toDate().getTime() > new Date().getTime()) {
            alert("Error: You cannot place an order before the Order Time");
        } else {
            storageRef.child(`${jio.jioID}.receipt`).put(image).then(
                () => {
                    storageRef
                        .child(`${jio.jioID}.receipt`)
                        .getDownloadURL()
                        .then(url => {
                            setUrl(url);
                            updateURL(url);
                            updateStatus("Orders Placed");
                            alert('You have uploaded your receipt!');
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                },
                error => {
                    console.log(error);
                }
            )
        }
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
                            <Select
                                placeholder="Remove User"
                                value={selectedOption.label}
                                options={getUsernames(jio)}
                                onChange={handleRemoveUser}
                                placeholder={"Select User To Remove From Jio"}
                            />
                            <p>
                                <button onClick={e => { remove(e, jio) }}>Remove User From Jio</button>
                            </p>
                            <td className="button" onClick={e => viewReceipt(e, jio)}>View Receipt</td>
                            <br />
                            <input type="file" onChange={e => { setImage(e.target.files[0]); setSelectedJio(jio); }} required />
                            <button onClick={e => { handleUpload(e, jio) }}>Upload Receipt</button>
                            <br /><br />
                            <button onClick={e => { notifyUsers(e, jio) }}>Notify Users Now</button>
                            <br />
                        </div>
                    ))
                }
                <br />
            </Container>
        </div>
    );
}