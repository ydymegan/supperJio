import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'


export default function JoinAJio() {
    
    const[startAJio, setstartAJio] = useState([]);
    const [loading, setLoading] = useState(false);

    const ref = db.collection("startAJio"); 
    
    function getJio() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setstartAJio(items);
            setLoading(false);
        });
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
                    <h1>Available Jio</h1>
                    {startAJio.map((jio) => (
                        <div key={jio.id}>
                            <h2>{jio.foodStore}</h2>
                            <p>{jio.deliveryApp}</p>
                            
                            
                            <p>{jio.collectionPoint}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}