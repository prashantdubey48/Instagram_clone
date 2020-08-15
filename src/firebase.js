import firebase from 'firebase'


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDTQtK-aF0Q7UqHgPn1l15yF8mciA5zc5c",
    authDomain: "instagram-aa796.firebaseapp.com",
    databaseURL: "https://instagram-aa796.firebaseio.com",
    projectId: "instagram-aa796",
    storageBucket: "instagram-aa796.appspot.com",
    messagingSenderId: "36893363945",
    appId: "1:36893363945:web:b1dfae6ded40060c86ea78",
    measurementId: "G-GDRBSL3Z4N"  
})

const db =firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db ,auth ,storage,}