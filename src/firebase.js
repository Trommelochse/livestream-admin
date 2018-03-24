import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DBURL,
  projectId: "be-livestream-admin",
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_SENDER_ID
};
export default firebase.initializeApp(config);
