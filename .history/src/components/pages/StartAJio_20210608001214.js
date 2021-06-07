
import React, { useState } from "react";
import Select from "react-select";
import { db } from '../../firebase.js';
import { Container } from "react-bootstrap";
import NavBar from '../layout/NavBar.js';
import './StartAJio.css';

export default function StartAJio() {
    const [foodStore, setFoodStore] = useState("");
    const [deliveryApp, setDeliveryApp] = useState("");
    const [collectionPoint, setCollectionPoint] = useState("");
    const [orderTime, setOrderTime] = useState("");
    const [region, setRegion] = useState("");

    const North = [
        {value:'25', label: "Woodlands, Admiralty"},
        {value:'27', label: "Sembawang, Yishun, Admiralty"},
        {value:'26', label: "Upper Thomson, Mandai"},
        {value:'28', label: "Yio Chu Kang, Seletar"}
    ]

    const South = [
        {value:'2', label: "Tanjong Pagar, Chinatown"},
        {value:'4', label: "Mount Faber, Telok Blangah, Harbourfront"},
        {value:'3', label: "Tiong Bahru, Alexandra, Queenstown"},
        {value:'6', label: "Clarke Quay, City Hall"},
        {value:'1', label:"Raffles Place, Marina, Cecil"},
        {value:'7', label:"Bugis, Beach Road, Golden Mile"}
    ]
    const East = [
        {value:'17', label: "Changi, Flora, Loyang"},
        {value:'16', label: "Bedok, Upper East Coast, Siglap"},
        {value:'18', label: "Tampines, Pasir Ris"},
        {value:'15', label: "Joo Chiat, Marina Parade, Katong"},
        {value:'14', label: "Geylang, Paya Lebar, Sims"},
        {value:'19', label: "Punggol, Sengkang, Serangoon Gardens"}
    ]

    const West = [
        {value:'22', label: "Boon Lay, Jurong, Tuas"},
        {value:'24', label: "Kranji, Lim Chu Kang, Tengah"},
        {value:'5', label: "Buona Vista, Pasir Panjang, Clementi"},
        {value:'21', label: "Upper Bukit Timah, Ulu Pandan, Clementi Park"},
        {value:'23', label:"Choa Chu Kang, Diary Farm, Hillview, Bukit Panjang, Bukit Batok"}
    ]

    const Central = [       
        {value:'11', label:"Novena, Newton, Thomson"},
        {value:'20', label:"Ang Mo Kio, Bishan, Thomson"},
        {value:'12', label:"Toa Payoh, Serangoon, Balestier"},
        {value:'13', label:"Macpherson, Braddell"},
        {value:'8', label:"Little India, Farrer Park"},
        {value:'9', label:"Orchard Road, River Valley"},
        {value:'10', label:"Bukit Timah, Holland, Balmoral"}
    ]

    const groupedOptions = [
        {label: "North", options: North},
        {label: "South", options: South},
        {label: "East", options: East},
        {label: "West", options: West},
        {label: "Central", options: Central}
    ]

    const [loader, setLoader] = useState(false);

    const handleChange = (e) => {
        setRegion({e});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        db.collection('StartAJio').add({
            foodStore: foodStore,
            deliveryApp: deliveryApp,
            collectionPoint: collectionPoint,
            orderTime: orderTime,
            region: region
        })
            .then(() => {
                alert('Your message has been submitted!')
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

    return (
        <div className="page">
            <NavBar></NavBar>

            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "150vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form" onSubmit=
                        {handleSubmit}>
                        <h1>Start A Jio</h1>

                        <label>Food Store</label>
                        <input
                            placeholder="Food Store"
                            value={foodStore}
                            onChange={(e) => setFoodStore(e.target.value)}
                        />

                        <label>Delivery App</label>
                        <input
                            placeholder="Delivery App"
                            value={deliveryApp}
                            onChange={(e) => setDeliveryApp(e.target.value)}
                        />

                        <label>Collection Point</label>
                        <input
                            placeholder="Collection Point"
                            value={collectionPoint}
                            onChange={(e) => setCollectionPoint(e.target.value)}
                        />

                        <label>Order Time</label>
                        <input
                            placeholder="Order Time"
                            value={orderTime}
                            onChange={(e) => setOrderTime(e.target.value)}
                        />

                        <label>Region</label>
                        <Select 
                            placeholder="Region"
                            value={region.value}
                            options={groupedOptions}
                            onChange={handleChange}
                        />

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