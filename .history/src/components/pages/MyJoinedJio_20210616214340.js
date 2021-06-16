import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";
import { groupedOptions } from "./RegionData.js";

export default function MyJoinedJio() {
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
        return startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByID(jio))
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
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form">
                        <h1>My Joined Jio</h1>
                        {filterJio()
                            .map((jio) => (
                                <div key={jio.id} className="jio">
                                    <h2>{jio.foodStore}</h2>
                                    <p>Delivery App: {jio.deliveryApp}</p>
                                    <p>Region: {jio.region.label}</p>
                                    <p>Collection Point: {jio.collectionPoint}</p>
                                    <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                    <p>My Orders: {displayOrders(jio)}</p>
                                </div>
                            ))}
                    </form>
                </div>
            </Container>
        </div>
    );
}