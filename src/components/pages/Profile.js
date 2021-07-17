import React, { useEffect, useState } from "react";
import NavBar from '../layout/NavBar.js';
import { Container, Button } from "react-bootstrap";
import firebase from "firebase/app";
import { db } from '../../firebase.js'
import './Profile.css';
import { FaStar } from 'react-icons/fa';

export default function Profile() {
    var user = firebase.auth().currentUser;

    const userRef = db.collection("users");
    const jioRef = db.collection("jio");
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [originalRating, setOriginalRating] = useState(0);
    const [activeList, setActiveList] = useState([]);

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
                <div className="displayreviews">
                    <h2>Pending User Rating</h2>
                    <ul>
                        
                        {activeList.map(activeJio => (
                            <div key={activeJio.id} className="box">
                                <p>Jio ID: {activeJio.activeJio.jioID}</p>
                                <p>Order Status: {activeJio.activeJio.orderStatus}</p>
                                {activeJio.activeJio.joinerUsernames}
                            
                            </div>
                        ))}
                    </ul>
                    {/* Things to do:
                        - create an array of active jios under the users 
                        - map out active jio
                        - only enable review after jio.orderStatus = ready for collection 
                        - once submitted, jio is removed from the array of active jios and will not be displayed */}
                </div>
            </Container>
        </div>
    );
}