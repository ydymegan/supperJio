import React, { useState, useEffect } from "react"
import { withRouter } from 'react-router-dom'
import { db } from '../../firebase.js'

function User(props) {
  const username = props.match.params.name;
  const userRef = db.collection("users");
  const [ratingList, setRatingList] = useState([]);
  const [reviewList, setReviewList] = useState([]);

  function getRatingAndReview() {
    userRef.get().then(queryResult => {
      const ratings = [];
      const reviews = [];
      queryResult.forEach(doc => {
        if (doc.data().username === username) {
          const userDetails = doc.data();
          ratings.push(userDetails.ratings);
          reviews.push(userDetails.reviews)
        }
      });
      setRatingList(ratings);
      setReviewList(reviews);
    });
  }

  useEffect(() => {
    getRatingAndReview();
    // eslint-disable-next-line
  }, []);

  console.warn(props)
  return (
    <div><h1>Rating {ratingList}</h1>
      <h1>Review {reviewList}</h1></div>

  )
}

export default withRouter(User);