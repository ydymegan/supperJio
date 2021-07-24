import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container, Button, Nav } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './JoinAJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";
import { groupedOptions } from "../../data/RegionData";

export default function JoinAJio() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const jioRef = db.collection("jio");
    const userRef = db.collection("users");
    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState("");
    const [order, setOrder] = useState("");
    const [selectedJio, setSelectedJio] = useState("");
    const [loader, setLoader] = useState(false);
    const [username, setUsername] = useState("");
    const [active, setActive] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [details, setDetails] = useState([]);

    function getDetails() {
        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setUsername(doc.data().username);
            setActive(doc.data().activeJio);
            setPendingList(doc.data().activeJioTracker);
        });

        jioRef.onSnapshot((querySnapshot) => { 
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setDetails(items);
        })
    }
    
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

    function getAvailableJio(jio) {
        return jio.orderTime.toDate().getTime() >= new Date().getTime();
    }

    function filterByRegion(selectedRegion, jio) {
        return selectedRegion.label === jio.region.label;
    }

    function filterByUsername(jio) {
        return username !== jio.starterUsername;
    }

    function filterJio() {
        return (region === "" || region.label === "") ?
            startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByUsername(jio)) :
            startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByRegion(region, jio)).filter(jio => filterByUsername(jio));
    }

    function submit(event) {
        event.preventDefault();

        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setActive(doc.data().activeJio);
            setPendingList(doc.data().activeJioTracker);
        });

        var idx;
        var check = true;
        
        for (idx = 0; idx < pendingList.length; idx++) {
            var i;
            for (i = 0; i < details.length; i++) {
                if (details[i].jioID === pendingList[idx].jioID && details[i].orderStatus === "Ready to Collect") {
                    var j
                    for (j = 0; j < pendingList[idx].reviewDone.length; j++) {
                        if (pendingList[idx].reviewDone[j] === false) {
                            check = false;
                            break;
                        }
                    }
                }
            }
        }

        if (order === "") {
            alert("Invalid Order");
        } else if (!check) {
            alert("Error: You have pending user reviews, please complete them in the Profile Page");
        } else if (active.length > 4) {
            alert ("Error: You are in 5 active jios");
        } else {
            return handleSubmit(event);
        }
    }

    useEffect(() => {
        getJio();
        getDetails();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption);
    };

    function update() {
        var originalActiveJioTracker = [];
        var newActiveJioTracker = [];
        var newUsers = [];
        var newReviewDone = [];
        var joinerActiveJioTracker = [];

        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // updating starter user's activeJioTracker
                if (doc.data().username === selectedJio.starterUsername) {
                    originalActiveJioTracker = doc.data().activeJioTracker;
                    var i;
                    for (i = 0; i < originalActiveJioTracker.length; i++) {
                        if (originalActiveJioTracker[i].jioID === selectedJio.jioID) {
                            newUsers = originalActiveJioTracker[i].users;
                            newReviewDone = originalActiveJioTracker[i].reviewDone;
                        } else {
                            newActiveJioTracker.push(originalActiveJioTracker[i]);
                        }
                    }

                    newUsers.push(username);
                    newReviewDone.push(false);
                    var t = {jioID: selectedJio.jioID, users: newUsers, reviewDone: newReviewDone}
                    newActiveJioTracker.push(t);

                    userRef.doc(doc.data().email).update({
                        activeJioTracker: newActiveJioTracker
                    })
                } 
                // updating joiner's activeJioTracker
                if (doc.data().username === username) {
                    joinerActiveJioTracker = doc.data().activeJioTracker;
                    var n = {jioID: selectedJio.jioID, users: [selectedJio.starterUsername], reviewDone: [false]}
                    joinerActiveJioTracker.push(n);

                    userRef.doc(user.email).update({
                        activeJio: active,
                        activeJioTracker: joinerActiveJioTracker
                    })
                }
            })
        })    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        var joinerUsernameArray = [];
        var orderArray = [];
        var i;
        var j;

        for (i = 0; i < selectedJio.joinerUsernames.length; i++) {
            joinerUsernameArray.push(selectedJio.joinerUsernames[i]);
        }

        var exists = false;

        for (j = 0; j < selectedJio.orders.length; j++) {
            if (joinerUsernameArray[j] === username) {
                var newOrder = selectedJio.orders[j] + ", " + order;
                orderArray.push(newOrder);
                exists = true;
            } else {
                orderArray.push(selectedJio.orders[j]);
            }
        }

        if (!exists) {
            joinerUsernameArray.push(username);
            orderArray.push(order);
            active.push(selectedJio.jioID);
            update();
        }
        
        jioRef.doc(selectedJio.jioID).update({ joinerUsernames: joinerUsernameArray, orders: orderArray }
        )
            .then(() => {
                alert('You have successfully joined a Jio!')
                setLoader(false);
            })
            .catch(error => {
                alert(error.message);
                setLoader(false);
            });

        setOrder("");
        setActive([]);
    };

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <Container style={{ width: "600px", justify: "center" }}>
                <div className="title">Filter Available Jios by Region</div>
                <Select
                    placeholder="Region"
                    value={selectedOption.label}
                    options={groupedOptions}
                    onChange={handleRegionChange}
                />
            </Container>
            <Container style={{ width: "600px", justify: "center" }}>
                <div className="title2">Available Jio</div>
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
                            <Nav.Link className="button2" href={'/user/' + jio.starterUsername}>View Starter Profile</Nav.Link>
                            <br></br>
                            <input
                                placeholder="Order"
                                value={(jio.jioID === selectedJio.jioID) ? order : null}
                                onClick={(e) => { setOrder(e.target.value); setSelectedJio(jio) }}
                                onChange={(e) => { setOrder(e.target.value); setSelectedJio(jio) }}
                                required />
                            <button type="submit" onClick={submit}
                                style={{
                                    background: loader
                                        ? "#ccc" : "#bdc1eb"
                                }}
                            >
                                Join
                            </button>
                        </div>
                    ))}
                <br />
            </Container>
        </div>
    );
}