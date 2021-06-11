import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './JoinAJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";

export default function JoinAJio() {

    const [startAJio, setstartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState("");
    var selectedOption = "";

    const ref = db.collection("jio");

    const handleChange = (selectedOption) => {
        setRegion( selectedOption );
    };

    const North = [
        { value: '25', label: "Woodlands, Admiralty" },
        { value: '27', label: "Sembawang, Yishun, Admiralty" },
        { value: '26', label: "Upper Thomson, Mandai" },
        { value: '28', label: "Yio Chu Kang, Seletar" }
    ]

    const South = [
        { value: '2', label: "Tanjong Pagar, Chinatown" },
        { value: '4', label: "Mount Faber, Telok Blangah, Harbourfront" },
        { value: '3', label: "Tiong Bahru, Alexandra, Queenstown" },
        { value: '6', label: "Clarke Quay, City Hall" },
        { value: '1', label: "Raffles Place, Marina, Cecil" },
        { value: '7', label: "Bugis, Beach Road, Golden Mile" }
    ]
    const East = [
        { value: '17', label: "Changi, Flora, Loyang" },
        { value: '16', label: "Bedok, Upper East Coast, Siglap" },
        { value: '18', label: "Tampines, Pasir Ris" },
        { value: '15', label: "Joo Chiat, Marina Parade, Katong" },
        { value: '14', label: "Geylang, Paya Lebar, Sims" },
        { value: '19', label: "Punggol, Sengkang, Serangoon Gardens" }
    ]

    const West = [
        { value: '22', label: "Boon Lay, Jurong, Tuas" },
        { value: '24', label: "Kranji, Lim Chu Kang, Tengah" },
        { value: '5', label: "Buona Vista, Pasir Panjang, Clementi" },
        { value: '21', label: "Upper Bukit Timah, Ulu Pandan, Clementi Park" },
        { value: '23', label: "Choa Chu Kang, Diary Farm, Hillview, Bukit Panjang, Bukit Batok" }
    ]

    const Central = [
        { value: '11', label: "Novena, Newton, Thomson" },
        { value: '20', label: "Ang Mo Kio, Bishan, Thomson" },
        { value: '12', label: "Toa Payoh, Serangoon, Balestier" },
        { value: '13', label: "Macpherson, Braddell" },
        { value: '8', label: "Little India, Farrer Park" },
        { value: '9', label: "Orchard Road, River Valley" },
        { value: '10', label: "Bukit Timah, Holland, Balmoral" }
    ]

    const groupedOptions = [
        { label: "North", options: North },
        { label: "South", options: South },
        { label: "East", options: East },
        { label: "West", options: West },
        { label: "Central", options: Central }
    ]

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

    function getAvailableJio(jio) {
        return jio.orderTime.toDate().getTime() >= new Date().getTime();
    }

    function filterByRegion(selectedRegion, jio) {
        return selectedRegion.label == jio.region.label;
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
            <label>Region</label>
            <Select
                placeholder="Region"
                value={selectedOption.label}
                options={groupedOptions}
                onChange={handleChange}
            />
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <h1>Available Jio</h1>
                    {startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByRegion(region, jio)).map((jio) => (
                        <div key={jio.id} className="jio">
                            <h2>{jio.foodStore}</h2>
                            <p>Delivery App: {jio.deliveryApp}</p>
                            <p>Region: {jio.region.label}</p>
                            <p>Collection Point: {jio.collectionPoint}</p>
                            <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <input></input>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}