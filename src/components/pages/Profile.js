import React, { useEffect, useState } from "react";
import NavBar from '../layout/NavBar.js';
import { Container, Button } from "react-bootstrap";
import firebase from "firebase/app";
import { db } from '../../firebase.js'
import './Profile.css';
import { FaStar } from 'react-icons/fa';
import Select from 'react-select';

export default function Profile() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const userRef = db.collection("users");
    const jioRef = db.collection("jio");
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [originalRating, setOriginalRating] = useState(0);
    const [activeList, setActiveList] = useState([]);
    const [reviewUser, setReviewUser] = useState("");
    const [userReview, setUserReview] = useState("");
    const [selectedJio, setSelectedJio] = useState("");

    function getRatings() {
        userRef.doc(user.email).get().then(queryResult => {
            setLoading(true);
            var length = queryResult.data().reviews.length;
            var i = 0;
            var list = [];
            if (length === 0) {
                list.push({ id: 0, review: "No Reviews Yet" });
            } else {
                while (length > 0) {
                    var r = { id: i, review: queryResult.data().reviews[length - 1] };
                    list.push(r);
                    length--;
                    i++;
                }
            }

            setOriginalRating(queryResult.data().ratingAverage);
            setUserRating(Math.round(queryResult.data().ratingAverage));
            setReviewList(list);
            setLoading(false);
        })
    }

    function getDetails() {
        var active = [];

        userRef.doc(user.email).get().then(queryResult => {
            active = queryResult.data().activeJio;
        })

        jioRef.onSnapshot((querySnapshot) => {
            setLoading(true);
            const items = [];

            querySnapshot.forEach((doc) => {
                var length = active.length;
                while (length > 0) {
                    if (doc.data().jioID === active[length-1]) {
                        var r = {id: length-1, activeJio: doc.data()};
                        items.push(r);
                    }
                    length--;
                }
            });

            setActiveList(items);
            setLoading(false);
        });
    }

    useEffect(() => {
        getRatings();
        getDetails();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    function getUsernames(activeJio) {
        var i;
        let options = [{ value: "", label: "" }];
        if (activeJio.activeJio.starterUsername !== user.username) {
            for (i = 0; i < activeJio.activeJio.joinerUsernames.length; i++) {
                options.push({ value: i, label: activeJio.activeJio.joinerUsernames[i] });
            }
        } else {
            options.push({ value: i, label: activeJio.activeJio.starterUsername });
        }
        return options;
    }
    
    const handleReview = (selectedOption) => {
        setReviewUser(selectedOption.label);
    };

    function handleSubmit(activeJio) {
        if (userReview === "") {
            alert("User Review is Empty");
        } else if (activeJio.activeJio.orderStatus !== "Ready to Collect") {
            alert("Unable to submit review as orders are not collected")
        }
        return submitReviews;
    }

    const submitReviews = () => {

        setReviewUser("");
        setUserReview("");
        setSelectedJio("");
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <Container>
                <div className="ratingTitle">
                Ratings
                <br />
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i+1;
                    return (
                        <FaStar
                            className="star"
                            size={50}
                            color={ratingValue <= userRating ? "#ffc107" : "e4e5e9"}
                        />
                    )
                })}
                <br />
                <div className="description">My Current Rating is {originalRating}</div>
                </div>
                <div className="displayreviews">
                    <h2>Reviews</h2>
                    <ul>
                        {reviewList.map(review => (
                            <p key={review.id} className="box">{review.review}</p>
                        ))}
                    </ul>
                </div>
            </Container>
            <Container>
                <div className="displayjios">
                    <h2>Pending User Rating</h2>
                    <ul>
                        
                        {activeList.map(activeJio => (
                            <div key={activeJio.id} className="box">
                                <p>Jio ID: {activeJio.activeJio.jioID}</p>
                                <p>Order Status: {activeJio.activeJio.orderStatus}</p>
                                <Select
                                className="select"
                                value={selectedOption.label}
                                options={getUsernames(activeJio)}
                                onChange={handleReview}
                                placeholder="Select User to Review"
                                />
                                <br />
                                <p>Reviewing {reviewUser} currently</p>
                                <input
                                placeholder="Type Your Review Here"
                                value={(activeJio.activeJio.jioID === selectedJio) ? userReview : null}
                                onClick={(e) => { setUserReview(e.target.value); setSelectedJio(activeJio.activeJio.jioID); }}
                                onChange={(e) => { setUserReview(e.target.value); setSelectedJio(activeJio.activeJio.jioID); }}
                                required />
                                <br />
                                <button className="button2" onClick={e => { handleSubmit(activeJio) }}>Submit Review</button>
                            </div>
                        ))}
                    </ul>
                    {/* Things to do:
                        - complete handle submit / submit review
                        - create a boolean array somewhere for getUsernames */}
                </div>
            </Container>
        </div>
    );
}