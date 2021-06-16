import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/database'
import 'firebase/firestore'

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

const app = firebase.initializeApp({
  apiKey: "AIzaSyD_wHa1ApvkJHZaoy1DcqRSgmTspWAUG40",
  authDomain: "supperjio-313906.firebaseapp.com",
  databaseURL: "gs://supperjio-313906.appspot.com"
  projectId: "supperjio-313906",
  storageBucket: "supperjio-313906.appspot.com",
  messagingSenderId: "218924193577",
  appId: "1:218924193577:web:b6b7ed6c099600553f8938"
})

const db = firebase.firestore();

export const auth = app.auth()
export { db }
export default app