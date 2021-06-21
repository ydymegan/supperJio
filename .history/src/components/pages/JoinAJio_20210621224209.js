import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './JoinAJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";
import { groupedOptions } from "./RegionData.js";

export default function JoinAJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState("");
    const [order, setOrder] = useState("");
    const [selectedJio, setSelectedJio] = useState("");
    var selectedOption = "";

    const ref = db.collection("jio");

    const [loader, setLoader] = useState(false);

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption);
    };



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

    function filterByRegion(selectedRegion, jio) {
        return selectedRegion.label === jio.region.label;
    }

    function filterByID(jio) {
        return user.uid !== jio.starterID;
    }

    function filterJio() {
        return (region === "" || region.label === "") ? 
        startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByID(jio)) : 
        startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByRegion(region, jio)).filter(jio => filterByID(jio));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        var joinerIDArray = [];
        var orderArray= []
        var i;
        var j;

        for (i = 0; i < selectedJio.joinerID.length; i++) {
            joinerIDArray.push(selectedJio.joinerID[i]);
        }

        for (j = 0; j < selectedJio.order.length; j++) {
            orderArray.push(selectedJio.order[j]);
        }

        joinerIDArray.push(user.uid);
        orderArray.push(order);

        ref.doc(selectedJio.jioID).update({joinerID: joinerIDArray, order: orderArray}
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
    };

    // function getJio() {
    //     setLoading(true);
    //     ref.get().then((item) => {
    //         const items = item.docs.map((doc) => doc.data());
    //         setstartAJio(items);
    //         setLoading(false);
    //     });
    // }

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
                            <input
                                placeholder="Order"
                                value={order}
                                onChange={(e) => { setOrder(e.target.value); setSelectedJio(jio) }} />
                            <button type="submit" onClick= {handleSubmit}
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