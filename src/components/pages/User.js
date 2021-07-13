import React, { useRef, useState, useEffect } from "react"
import { withRouter } from 'react-router-dom'
import { db } from '../../firebase.js'

function User(props) {
  const [emailList, setEmailList] = useState([]);
  const ref = db.collection("users");

  function getEmails() {
    ref.get().then(queryResult => {
      const items = [];
      queryResult.forEach(doc => {
        const userDetails = doc.data();
        items.push(userDetails.email);
      });
      setEmailList(items);
    });
  }

  useEffect(() => {
    getEmails();
    // eslint-disable-next-line
  }, []);

  function getRatingsAndReviews(name) {
    var s = "";
    return ref.doc(emailList[0]).username);

    // for (i = 0; i < emailList.length; i++) {
    //   var docRef = ref.doc(emailList[i]);
    //   docRef.get().then((doc) => {
    //     (doc.data().username === name) ? check = "true" : check = "false"
    //   });
    // }

    // //return check;
  }

  console.warn(props)
  return (
    <div><h1>User No {getRatingsAndReviews(props.match.params.name)}</h1>
      <h1>User Name {props.match.params.name}</h1></div>

  )
}

export default withRouter(User);