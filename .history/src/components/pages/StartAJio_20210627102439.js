import DatePicker from "react-datepicker"
import "react-datepicker/src/stylesheets/datepicker.scss";
import React, { useState } from "react";
import Select from "react-select";
import { db } from '../../firebase.js';
import { Container, Button } from "react-bootstrap";
import NavBar from '../layout/NavBar.js';
import './StartAJio.css';
import firebase from "firebase/app";
import { groupedOptions } from "./RegionData.js";

export default function StartAJio() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const [foodStore, setFoodStore] = useState("");
    const [deliveryApp, setDeliveryApp] = useState("");
    const [collectionPoint, setCollectionPoint] = useState("");
    const [orderTime, setOrderTime] = useState("");
    const [region, setRegion] = useState("");
    const jioID = Math.random().toString();
    const [loader, setLoader] = useState(false);

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        db.collection('jio').doc(jioID).set({
            jioID: jioID,
            starterID: user.uid,
            foodStore: foodStore,
            deliveryApp: deliveryApp,
            collectionPoint: collectionPoint,
            orderTime: orderTime,
            region: region,
            joinerID: [],
            order: [],
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

        setFoodStore("");
        setDeliveryApp("");
        setCollectionPoint("");
        setOrderTime("");
        setRegion("");
    };

    function submit(event) {
        event.preventDefault();

        if (orderTime < new Date()) {
            alert("Order time is invalid");
            setLoader(false);
        } else if (region === "" || region.label === "" || region.value === "") {
            alert("Region not set");
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