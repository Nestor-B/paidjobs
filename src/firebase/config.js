// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAluLH-PuHwwfMOqPw8zVcUHg8Mni1RxF4",
    authDomain: "piadjobs.firebaseapp.com",
    projectId: "piadjobs",
    storageBucket: "piadjobs.appspot.com",
    messagingSenderId: "922864531601",
    appId: "1:922864531601:web:2a9f21bee5928d38fce730"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
    app,
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signOut
}