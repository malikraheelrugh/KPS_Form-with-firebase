import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// These values come from the .env file in the project root — open .env
// and paste in your own Firebase project's keys (Project settings >
// General > Your apps (Web app) in https://console.firebase.google.com/).
// No other file needs to change.
const firebaseConfig = {
 apiKey: "AIzaSyDJXFac5ifBBuY6PZjwSyjrshhjIs0Meaw",
  authDomain: "kpsschool-5da8c.firebaseapp.com",
  projectId: "kpsschool-5da8c",
  storageBucket: "kpsschool-5da8c.firebasestorage.app",
  messagingSenderId: "1087312453874",
  appId: "1:1087312453874:web:e17b5932355303c5e8706b",
  measurementId: "G-JTTBJV04ZS"
}

const isConfigured = Object.values(firebaseConfig).every(Boolean)

if (!isConfigured) {
  console.warn(
    '[firebase.js] Missing Firebase config. Open the .env file in the ' +
      'project root and paste in your Firebase project keys.'
  )
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const firebaseConfigured = isConfigured
