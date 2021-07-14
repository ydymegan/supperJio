import React, { useEffect, useState } from "react";
import NavBar from '../layout/NavBar.js';
import { Container, Button } from "react-bootstrap";
import firebase from "firebase/app";
import { db } from '../../firebase.js'
import './Profile.css';

export default function Profile() {
    var user = firebase.auth().currentUser;

    const userRef = db.collection("users");
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);

    function getReview() {
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
            setReviewList(list);
            setLoading(false);
        })
    }

    useEffect(() => {
        getReview();
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
                <div className="ratingTitle">Ratings</div>
                {/* insert rating here */}
                <div className="displayreviews">
                    <h2>Reviews</h2>
                    <ul>
                        {reviewList.map(review => (
                            <p key={review.id} className="box">{review.review}</p>
                        ))}
                    </ul>
                </div>
            </Container>
        </div>
    );
}