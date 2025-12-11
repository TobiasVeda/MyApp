// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBwts3Qz8yY5d4XbwFofPZALerrtMuSepA",
	authDomain: "myapp-96de8.firebaseapp.com",
	projectId: "myapp-96de8",
	storageBucket: "myapp-96de8.firebasestorage.app",
	messagingSenderId: "297429616324",
	appId: "1:297429616324:web:5e3f53eefe2a5e9dc72b91",
	measurementId: "G-P1B4CRL4XK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }