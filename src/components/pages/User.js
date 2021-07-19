import React, { useState, useEffect } from "react"
import { withRouter, useHistory } from 'react-router-dom'
import { db } from '../../firebase.js'
import { Container, Button } from "react-bootstrap";
import { FaStar } from 'react-icons/fa';
import './User.css'
import NavBar from '../layout/NavBar.js'

function User(props) {
  const username = props.match.params.name;
  const userRef = db.collection("users");
  const [reviewList, setReviewList] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [originalRating, setOriginalRating] = useState(0);
  let history = useHistory();
  
  function getRatingAndReview() {
    userRef.get().then(queryResult => {
      var reviews = [];
      queryResult.forEach(doc => {
        if (doc.data().username === username) {
          const userDetails = doc.data();
          var length = userDetails.reviews.length;
          var i = 0;

          if (length === 0) {
            reviews.push({ id: 0, review: "No Reviews Yet" });
          } else {
            while (length > 0) {
              var r = { id: i, review: userDetails.reviews[length - 1] };
              reviews.push(r);
              length--;
              i++;
            }
          }
          setOriginalRating(userDetails.ratingAverage);
          setUserRating(Math.round(userDetails.ratingAverage));
        }
      });
      setReviewList(reviews);
    });
  }

  useEffect(() => {
    getRatingAndReview();
    // eslint-disable-next-line
  }, []);

  console.warn(props)
  return (
    <div className="page">
      <NavBar></NavBar>
      <Button onClick={history.goBack} className="button">Back</Button>
      <Container>
        <div className="profile">
          Profile: {username}
        </div>
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
          <div className="description">{username}'s current rating is {originalRating}</div>
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
    </div>

  )
}

export default withRouter(User);