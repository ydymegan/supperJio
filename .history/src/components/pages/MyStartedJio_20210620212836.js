import React, { useState, useEffect } from "react"
import { db, storage } from '../../firebase.js'
import { Container, Button } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyStartedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function MyStartedJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJio, setSelectedJio] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const ref = db.collection("jio");
    const storageRef = storage.ref("receipts");

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

    function updateURL(url) {
        ref.doc(selectedJio.jioID).update({ receiptURL: url });
    }

    function updateStatus(message) {
        // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  var text = document.getElementById("text");
        
        if (checkBox.checked == true){
            text.style.display = "block";
          } else {
            text.style.display = "none";
          }
        ref.doc(selectedJio.jioID).update({ orderStatus: message});
    }

    const updateOrder = () => {

        ref.doc(selectedJio.jioID).update({ 
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
        console.log(selectedJio.jioID)
        setSelectedJio("");

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
                            <p>Joiner Orders: {displayOrders(jio)}</p>
                            <p>Receipt URL: {jio.receiptURL} </p>
                            <input type="file" onChange={e => { setImage(e.target.files[0]); setSelectedJio(jio); }} />
                            <button onClick={handleUpload}>Upload Receipt</button>
                            <br />
                            <br />
                            <input type="checkbox" id="myCheck" onclick="myFunction()"></input>
                            <p id="text" style="display:none">Checkbox is CHECKED!</p>
                            <br />
                        </div>
                    ))
                }
                <br />
            </Container>
        </div>
    );
}
