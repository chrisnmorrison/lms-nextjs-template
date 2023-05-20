import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBSIiAbBLvt3N6f0K66BDUAMsizb6JDJnE",

  authDomain: "italian-mobile-app.firebaseapp.com",

  projectId: "italian-mobile-app",

  storageBucket: "italian-mobile-app.appspot.com",

  messagingSenderId: "474565072674",

  appId: "1:474565072674:web:2c306e65ccd4640953b77b",

  measurementId: "G-F0S6SCTG9V"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)