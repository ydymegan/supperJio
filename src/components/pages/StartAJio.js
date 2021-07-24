import DatePicker from "react-datepicker"
import "react-datepicker/src/stylesheets/datepicker.scss";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { db } from '../../firebase.js';
import { Container, Button } from "react-bootstrap";
import NavBar from '../layout/NavBar.js';
import './StartAJio.css';
import firebase from "firebase/app";
import { groupedOptions } from "../../data/RegionData";

export default function StartAJio() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const userRef = db.collection("users");
    const jioRef = db.collection("jio");
    const [foodStore, setFoodStore] = useState("");
    const [deliveryApp, setDeliveryApp] = useState("");
    const [collectionPoint, setCollectionPoint] = useState("");
    const [orderTime, setOrderTime] = useState("");
    const [region, setRegion] = useState("");
    const [loader, setLoader] = useState(false);
    const [username, setUsername] = useState("");
    const [jioStarted, setJioStarted] = useState(0);
    const [active, setActive] = useState([]);
    const [pendingList, setPendingList] = useState([]);
    const [details, setDetails] = useState([]);

    function getDetails() {
        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setUsername(doc.data().username);
            setJioStarted(doc.data().numOfJioStarted);
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
    
    useEffect(() => {
        getDetails(); 
        // eslint-disable-next-line
    }, []);

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true); 
        
        var originalActiveJioTracker = [];

        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setActive(doc.data().activeJio);
            setJioStarted(doc.data().numOfJioStarted); 
            originalActiveJioTracker = doc.data().activeJioTracker;

            jioRef.doc(username + "_" + jioStarted).set({
                jioID: username + "_" + jioStarted,
                starterUsername: username,
                foodStore: foodStore,
                deliveryApp: deliveryApp,
                collectionPoint: collectionPoint,
                orderTime: orderTime,
                region: region,
                joinerUsernames: [],
                orders: [],
                receiptURL: "",
                orderStatus: "Collating Orders"
            })
                .then(() => {
                    alert('You have successfully started a Jio!')
                    setLoader(false);
                })
                .catch(error => {
                    alert(error.message);
                    setLoader(false);
                });
    
            active.push(username + "_" + jioStarted);
    
            var newActiveJioTracker = [];
            var i;
            for (i = 0; i < originalActiveJioTracker.length; i++) {
                newActiveJioTracker.push(originalActiveJioTracker[i]);
            }
    
            i = {jioID: username + "_" + jioStarted, users: [], reviewDone: []};
            newActiveJioTracker.push(i);
    
            userRef.doc(user.email).update({
                numOfJioStarted: (jioStarted+1),
                activeJio: active,
                activeJioTracker: newActiveJioTracker
            })
        });

        setFoodStore("");
        setDeliveryApp("");
        setCollectionPoint("");
        setOrderTime("");
        setRegion("");
        // setActive([]);
        // setJioStarted(0);
    };

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

        if (orderTime < new Date()) {
            alert("Order time is invalid");
            setLoader(false);
        } else if (region === "" || region.label === "" || region.value === "") {
            alert("Region not set");
            setLoader(false);
        } else if (!check) {
            alert("Error: You have pending user reviews, please complete them in the Profile Page");
            setLoader(false);
        } else if (active.length > 4) {
            alert("Error: You are in 5 active jios");
            setLoader(false);
        } else {
            return handleSubmit(event);
        }
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "150vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form" onSubmit=
                        {submit}>
                        <h1>Start A Jio</h1>

                        <label>Food Store</label>
                        <input
                            placeholder="Food Store"
                            value={foodStore}
                            onChange={(e) => setFoodStore(e.target.value)}
                            required
                        />

                        <label>Delivery App</label>
                        <input
                            placeholder="Delivery App"
                            value={deliveryApp}
                            onChange={(e) => setDeliveryApp(e.target.value)}
                            required
                        />

                        <label>Collection Point</label>
                        <input
                            placeholder="Collection Point"
                            value={collectionPoint}
                            onChange={(e) => setCollectionPoint(e.target.value)}
                            required
                        />

                        <label>Order Time</label>
                        <DatePicker
                            selected={orderTime}
                            onChange={(e) => setOrderTime(e)}
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            minDate={new Date()}
                            showTimeInput
                            required
                        />
                        <br></br>
                        <label>Region</label>
                        <Select
                            placeholder="Region"
                            value={selectedOption.label}
                            options={groupedOptions}
                            onChange={handleRegionChange}
                            required
                        />
                        <br></br>
                        <button type="submit" style={{
                            background: loader
                                ? "#ccc" : "#5C65CF"
                        }}
                        >
                            Submit
                        </button>

                    </form>
                </div>
            </Container>
        </div>
    );
}