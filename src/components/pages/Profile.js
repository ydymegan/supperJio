import React, { useEffect, useState } from "react";
import NavBar from '../layout/NavBar.js';
import { Container, Button } from "react-bootstrap";
import firebase from "firebase/app";
import { db } from '../../firebase.js'
import './Profile.css';
import { FaStar } from 'react-icons/fa';
import Select from 'react-select';
import { useHistory } from 'react-router-dom'

export default function Profile() {
    var user = firebase.auth().currentUser;
    var selectedOption = "";

    const userRef = db.collection("users");
    const jioRef = db.collection("jio");
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState(""); // username of current user
    const [userRating, setUserRating] = useState(0); // rounded off rating
    const [originalRating, setOriginalRating] = useState(0); // original rating 
    const [active, setActive] = useState([]); // active list (jioID only)
    const [activeList, setActiveList] = useState([]); // active list of jios
    const [tracker, setTracker] = useState([]); // for active jio tracker details of current user
    const [reviewUser, setReviewUser] = useState(""); // for username of user being rated
    const [userReview, setUserReview] = useState(""); // for written review
    const [selectedJio, setSelectedJio] = useState(""); // for jio ID
    const [starRating, setStarRating] = useState(0); // for star rating
    const [hover, setHover] = useState(null);
    let history = useHistory();

    function getRatings() {
        userRef.doc(user.email).get().then(queryResult => {
            setLoading(true);
            var length = queryResult.data().reviews.length;
            var i = 0;
            var list = [];
            while (length > 0) {
                var r = { id: i, review: queryResult.data().reviews[length - 1] };
                list.push(r);
                length--;
                i++;
            }


            setActive(queryResult.data().activeJio);
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
            setTracker(queryResult.data().activeJioTracker);
            setUsername(queryResult.data().username);
        })

        jioRef.onSnapshot((querySnapshot) => {
            setLoading(true);
            const items = [];

            querySnapshot.forEach((doc) => {
                var length = active.length;
                while (length > 0) {
                    if (doc.data().jioID === active[length - 1]) {
                        var r = { id: length - 1, activeJio: doc.data() };
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
        var j;
        var k = 0;
        let options = [{ value: "", label: "" }];
        for (i = 0; i < tracker.length; i++) {
            if (tracker[i].jioID === activeJio.activeJio.jioID) {
                for (j = 0; j < tracker[i].users.length; j++) {
                    if (tracker[i].reviewDone[j] === false) {
                        options.push({ value: k, label: tracker[i].users[j] });
                        k++;
                    }
                }
            }
        }

        return options;
    }

    function getFoodOrder(orders, joinerUsernames) {
        var order = "";
        var idx;

        for (idx = 0; idx < joinerUsernames.length; idx++) {
            if (joinerUsernames[idx] === username) {
                order = orders[idx];
            }
        }

        if (order === "") {
            order = "You Started the Jio";
        }

        return order;
    }

    function filterByJoiner(activeJio) {
        return activeJio.activeJio.joinerUsernames.length !== 0;
    }

    function filterByStatus(activeJio) {
        return activeJio.activeJio.orderStatus === "Ready to Collect";
    }

    function filterActiveList() {
        if (activeList.length > 0) {
            return activeList.filter(activeJio => filterByJoiner(activeJio)).filter(activeJio => filterByStatus(activeJio));
        } else {
            return activeList;
        }
    }

    const handleReview = (selectedOption) => {
        setReviewUser(selectedOption.label);
    };

    function handleSubmit(activeJio) {
        if (reviewUser === "") {
            alert("No User Selected to Review");
        } else if (starRating === 0) {
            alert("Please Indicate a Start Rating");
        } else if (userReview === "") {
            alert("User Review is Empty");
        } else if (activeJio.activeJio.orderStatus !== "Ready to Collect") {
            alert("Unable to submit review as orders are not collected")
        } else {
            return submitReviews();
        }
    }

    const submitReviews = () => {

        var details;

        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().username === reviewUser) {
                    details = doc.data();

                    var newRatingArray = [];
                    var newReviewsArray = [];
                    var newActiveJioTracker = [];
                    var newActiveJio = [];

                    var i;
                    for (i = 0; i < details.ratingArray.length; i++) {
                        newRatingArray.push(details.ratingArray[i]);
                    }

                    newRatingArray.push(starRating);

                    var idx = 0;
                    var sum = 0;

                    for (idx = 0; idx < newRatingArray.length; idx++) {
                        sum += newRatingArray[idx];
                    }

                    var newRatingAverage = sum / newRatingArray.length;

                    for (i = 0; i < details.reviews.length; i++) {
                        newReviewsArray.push(details.reviews[i]);
                    }

                    newReviewsArray.push(userReview);

                    for (i = 0; i < tracker.length; i++) {
                        var t;
                        if (tracker[i].jioID === selectedJio) {
                            var newReviewDone = [];
                            for (idx = 0; idx < tracker[i].users.length; idx++) {
                                newReviewDone[idx] = ((tracker[i].users[idx] === reviewUser) || (tracker[i].reviewDone[idx] === true)) ? true : false;
                            }

                            var j;
                            var count = 0;
                            for (j = 0; j < newReviewDone.length; j++) {
                                count += (newReviewDone[j] === false) ? 1 : 0;
                            }

                            if (count === 0) {
                                var k;
                                for (k = 0; k < active.length; k++) {
                                    if (active[k] !== selectedJio) {
                                        newActiveJio.push(active[k]);
                                    }
                                }
                            } else {
                                newActiveJio = active
                                t = { jioID: selectedJio, users: tracker[i].users, reviewDone: newReviewDone }
                                newActiveJioTracker.push(t)
                            }

                        } else {
                            t = { jioID: tracker[i].jioID, users: tracker[i].users, reviewDone: tracker[i].reviewDone }
                            newActiveJioTracker.push(t)
                        }
                    }

                    userRef.doc(user.email).update({
                        activeJioTracker: newActiveJioTracker,
                        activeJio: newActiveJio
                    })

                    setTracker(newActiveJioTracker);

                    userRef.doc(details.email).update({
                        ratingArray: newRatingArray,
                        ratingAverage: newRatingAverage.toFixed(2),
                        reviews: newReviewsArray,
                    }).then(() => {
                        alert('You have successfully submitted your review!')
                    })
                        .catch(error => {
                            alert(error.message);
                        });
                }
            })
        });

        setReviewUser("");
        setUserReview("");
        setSelectedJio("");
        setStarRating(0);
        setHover(null);
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button onClick={history.goBack} className="button">Back</Button>
            <Container>
                <div className="ratingTitle">
                    Ratings
                    <br />
                    {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                            <FaStar
                                className="star"
                                size={50}
                                color={ratingValue <= userRating ? "#ffc107" : "e4e5e9"}
                            />
                        )
                    })}
                    <br />
                    <div className="description">My Average Rating is {originalRating}</div>
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
                        {filterActiveList().map(activeJio => (
                            <div key={activeJio.id} className="box">
                                <p>Food Store: {activeJio.activeJio.foodStore}</p>
                                <p>Food Order: {getFoodOrder(activeJio.activeJio.orders, activeJio.activeJio.joinerUsernames)}</p>
                                <Select
                                    className="select"
                                    value={selectedOption.label}
                                    options={getUsernames(activeJio)}
                                    onChange={handleReview}
                                    placeholder="Select User to Review"
                                />
                                <br />
                                <div className="starRating">
                                    {[...Array(5)].map((star, i) => {
                                        const ratingValue = i + 1;
                                        return (
                                            <label>
                                                <input
                                                    type="radio"
                                                    className="rating"
                                                    value={ratingValue}
                                                    onClick={() => { setStarRating(ratingValue); setSelectedJio(activeJio.activeJio.jioID); }}
                                                />
                                                <FaStar
                                                    className="star"
                                                    size={30}
                                                    color={(ratingValue <= (hover || starRating)) && (activeJio.activeJio.jioID === selectedJio) ? "#ffc107" : "e4e5e9"}
                                                    onMouseEnter={() => (activeJio.activeJio.jioID === selectedJio) ? setHover(ratingValue) : null}
                                                    onMouseLeave={() => (activeJio.activeJio.jioID === selectedJio) ? setHover(null) : null}
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                                <p>Your selected rating is {(activeJio.activeJio.jioID === selectedJio) ? starRating + " / 5" : "..."}</p>
                                <input
                                    placeholder="Type Your Review Here"
                                    value={(activeJio.activeJio.jioID === selectedJio) ? userReview : null}
                                    onClick={(e) => { setUserReview(e.target.value); setSelectedJio(activeJio.activeJio.jioID); }}
                                    onChange={(e) => { setUserReview(e.target.value); setSelectedJio(activeJio.activeJio.jioID); }}
                                    required
                                />
                                <br />
                                <button className="button3" onClick={e => { handleSubmit(activeJio) }}>Submit Review</button>
                            </div>
                        ))}
                    </ul>
                </div>
            </Container>
        </div>
    );
}