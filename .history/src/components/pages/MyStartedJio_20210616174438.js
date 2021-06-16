import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";
import { groupedOptions } from "./RegionData.js";

export default function MyStartedJio() {
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
        return user.uid === jio.starterID;
    }

    function filterJio() {
        return startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByID(jio))
    }

    function displayOrders(jio) {
        if (jio.starterID === user.uid) {
            var i;
            let output = "";
            for (i = 0; i < jio.order.length; i++) {
                (i === jio.order.length - 1) ? output += jio.order[i] : output += jio.order[i] + ", ";
            }
            return output;
        }

    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoader(true);

    //     var joinerIDArray = [];
    //     var orderArray = []
    //     var i;
    //     var j;

    //     for (i = 0; i < selectedJio.joinerID.length; i++) {
    //         joinerIDArray.push(selectedJio.joinerID[i]);
    //     }

    //     for (j = 0; j < selectedJio.order.length; j++) {
    //         orderArray.push(selectedJio.order[j]);
    //     }

    //     joinerIDArray.push(user.uid);
    //     orderArray.push(order);

    //     ref.doc(selectedJio.jioID).update({ joinerID: joinerIDArray, order: orderArray }
    //     )
    //         .then(() => {
    //             alert('You have successfully joined a Jio!')
    //             setLoader(false);
    //         })
    //         .catch(error => {
    //             alert(error.message);
    //             setLoader(false);
    //         });

    //     setOrder("");
    // };

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            error => {
                console.log(error);
            },
            () => {
                storage 
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url);
                    });
            }
        )
    };
    

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
                        <h1>My Started Jio</h1>
                        {filterJio()
                            .map((jio) => (
                                <div key={jio.id} className="jio">
                                    <h2>{jio.foodStore}</h2>
                                    <p>Delivery App: {jio.deliveryApp}</p>
                                    <p>Region: {jio.region.label}</p>
                                    <p>Collection Point: {jio.collectionPoint}</p>
                                    <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                    <p>Joiner Orders: {displayOrders(jio)}</p>
                                </div>
                            ))}
                        <br />
                        <progress value={progress} max="100" />
                        <br />
                        <input type="file" onChange={handleChange} />
                        <button onClick={handleUpload}>Upload</button>
                        {/* < br/>
                        {url}
                        <br /> */}
                        {/* <img src= {url || "http://via.placeholder.com/300x400"} alt="firebase-image" />  */}
                    </form>
                </div>
            </Container>
        </div>
    );
}