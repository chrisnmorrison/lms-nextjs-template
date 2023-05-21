import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBSIiAbBLvt3N6f0K66BDUAMsizb6JDJnE",

  authDomain: "italian-mobile-app.firebaseapp.com",

  projectId: "italian-mobile-app",

  storageBucket: "italian-mobile-app.appspot.com",

  messagingSenderId: "474565072674",

  appId: "1:474565072674:web:2c306e65ccd4640953b77b",

  measurementId: "G-F0S6SCTG9V"
}

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);