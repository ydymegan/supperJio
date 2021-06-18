import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container, Image } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function MyStartedJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");

    const ref = db.collection("jio");

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
        return startAJio.filter(jio => filterByID(jio))
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

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    // const [imageUrl, setImageUrl] = useState(undefined);
    
    // const getImage = () => {
        
    //     storage()
    //         .ref(`receipts/${selectedJio.jioID}.receipt`)
    //         .getDownloadURL()
    //         .then((url) => {
    //             setImageUrl(url);
    //         })
    //         .catch((e) => console.log('Errors while downloading => ', e));
        
    // };

    // function getImage(jio) {
    //     setImageUrl(storage().ref(`receipts/${jio}.receipt`).getDownloadURL());
    //     return true;
    // }

    const handleUpload = () => {
        
        const uploadTask = storage.ref(`receipts/${selectedJio.jioID}.receipt`).put(image);
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
                    .ref(selectedJio.jioID)
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setUrl(url);
                    });
            }
        )
        setSelectedJio("");
    };

    console.log("image: ", image);

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
        <h1>My Started Jio</h1>
            <Container style={{ width: "max-content", justify: "center"}}>
                {filterJio()
                    .map((jio) => (
                        <div key={jio.id} className="jio">
                            <h2>{jio.foodStore}</h2>
                            <p>Delivery App: {jio.deliveryApp}</p>
                            <p>Region: {jio.region.label}</p>
                            <p>Collection Point: {jio.collectionPoint}</p>
                            <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <p>Joiner Orders: {displayOrders(jio)}</p>
                            <br />
                            <progress value={progress} max="100" />
                            <br />
                            <input type="file" onChange = {e => {setImage(e.target.files[0]); setSelectedJio(jio)}}/>
                            <button onClick={handleUpload}>Upload Receipt</button>
                            < br/>
                            {url}
                            <br />
                            <Image src={url || "http://via.placeholder.com/300x300"} alt="firebase-image" />
                            {/* <button onClick = {e => {getImage(jio.id)}}> Receipt Image<Image source={{uri: imageUrl}} /></button> */}
                        </div>
                    ))}
                <br /> 
            </Container> 
        </div>
    );
}