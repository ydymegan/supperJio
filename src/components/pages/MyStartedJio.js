import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container, Button, Nav } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";

export default function MyStartedJio() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const jioRef = db.collection("jio");
    const userRef = db.collection("users");
    const storageRef = storage.ref("receipts");
    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    function setUser() {
        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setUsername(doc.data().username);
        });
    }

    useEffect(() => {
        setUser();
        // eslint-disable-next-line
    }, []);

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
                output += jio.joinerUsernames[i] + ": " + jio.orders[i];
                output += (i === jio.orders.length - 1) ? "" : ", ";
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

        if (selectedUser === "") {
            alert("Error: You have not selected any user");
        } else if (jio.orderTime.toDate().getTime() < new Date().getTime()) {
            console.log(jio.orderTime);
            alert("Error: You are unable to remove users after order time.");
        } else {
            return removeUserAndOrder(event, jio);
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

    const handleSelectUser = (selectedOption) => {
        setSelectedUser(selectedOption.label);
    };

    function update(jio) {
        var newActive = [];
        var newActiveJioTracker = [];
        var i;

        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                // updating active jio and active jio tracker of the removed user
                if (doc.data().username === selectedUser) {
                    for (i = 0; i < doc.data().activeJio.length; i++) {
                        if (doc.data().activeJio[i] !== jio.jioID) {
                            newActive.push(doc.data().activeJio[i]);
                        }
                        if (doc.data().activeJioTracker[i].jioID !== jio.jioID) {
                            newActiveJioTracker.push(doc.data().activeJioTracker[i]);
                        }
                    }

                    userRef.doc(doc.data().email).update({
                        activeJio: newActive,
                        activeJioTracker: newActiveJioTracker
                    })
                }

                // updating starter user's active jio tracker
                var newUsers = [];
                var newReviewDone = [];

                if (doc.data().username === jio.starterUsername) {
                    newActiveJioTracker = [];
                    for (i = 0; i < doc.data().activeJioTracker.length; i++) {
                        if (doc.data().activeJioTracker[i].jioID === jio.jioID) {
                            var idx;
                            for (idx = 0; idx < doc.data().activeJioTracker[i].users.length; idx++) {
                                if (doc.data().activeJioTracker[i].users[idx] !== selectedUser) {
                                    newUsers.push(doc.data().activeJioTracker[i].users[idx]);
                                    newReviewDone.push(doc.data().activeJioTracker[i].reviewDone[idx]);
                                }
                            }
                        } else {
                            newActiveJioTracker.push(doc.data().activeJioTracker[i]);
                        }
                    }

                    var t = { jioID: jio.jioID, users: newUsers, reviewDone: newReviewDone };
                    newActiveJioTracker.push(t);

                    userRef.doc(doc.data().email).update({
                        activeJioTracker: newActiveJioTracker
                    })
                }
            })
        })
    }

    const removeUserAndOrder = (e, jio) => {
        e.preventDefault();

        var joinerUsernameArray = [];
        var orderArray = []
        var i;
        var j;
        var idxForOrders = [];
        var k = 0;

        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (jio.joinerUsernames[i] !== selectedUser) {
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

        update(jio);

        // updating jio document
        jioRef.doc(jio.jioID).update({ joinerUsernames: joinerUsernameArray, orders: orderArray }
        )
            .then(() => {
                alert('You have successfully removed the user!')
            })
            .catch(error => {
                alert(error.message);
            });

    };

    const updateOrder = (jio) => {
        jioRef.doc(jio.jioID).update({
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

    function deleting(e, jio) {
        e.preventDefault();
        if (jio.orderTime.toDate().getTime() < new Date().getTime()) {
            alert("You cannot delete the jio after the order time");
        } else {
            return deleteJio(e, jio);
        }
    }

    const deleteJio = (e, jio) => {
        e.preventDefault();

        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var details = doc.data();
                var i;
                var newActiveJio = [];
                var newActiveJioTracker = [];

                for (i = 0; i < details.activeJio.length; i++) {
                    if (details.activeJio[i] !== jio.jioID) {
                        newActiveJio.push(details.activeJio[i]);
                    }
                }

                for (i = 0; i < details.activeJioTracker.length; i++) {
                    if (details.activeJioTracker[i].jioID !== jio.jioID) {
                        newActiveJioTracker.push(details.activeJioTracker[i]);
                    }
                }

                userRef.doc(details.email).update({
                    activeJio: newActiveJio,
                    activeJioTracker: newActiveJioTracker
                })
            })
        })

        jioRef.doc(jio.jioID).get().then(queryResult => {
            queryResult.ref.delete();
        }).then(() => {
            alert('You have successfully deleted the jio!')
        })
            .catch(error => {
                alert(error.message);
            });
    }

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
                            <p>Joiners/Orders: {displayOrders(jio)}</p>
                            <Select
                                value={selectedOption.label}
                                options={getUsernames(jio)}
                                onChange={handleSelectUser}
                                placeholder="Select User To Remove From Jio / View Profile"
                            />
                            <br />
                            <div className="set">
                                <button className="button2" onClick={e => { remove(e, jio) }}>Remove User From Jio</button>
                                <Nav.Link className="button2" href={(selectedUser !== "") ? '/user/' + selectedUser : '/my-started-jio'}>View User Profile</Nav.Link>
                            </div>
                            <br />
                            <input type="file" onChange={e => { setImage(e.target.files[0]); setSelectedJio(jio); }} required />
                            <button className="button2" onClick={e => { handleUpload(e, jio) }}>Upload Receipt</button>
                            <br /><br />
                            <div className="set">
                                <td className="button2" onClick={e => viewReceipt(e, jio)}>View Receipt</td>
                                <button className="button2" onClick={e => { notifyUsers(e, jio) }}>Notify Users for Collection</button>
                                <button className="button2" onClick={e => { deleting(e, jio) }}>Delete Jio</button>
                            </div>
                        </div>
                    ))
                }
                <br />
            </Container>
        </div>
    );
}