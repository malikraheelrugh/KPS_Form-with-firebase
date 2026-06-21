import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// These values come from the .env file in the project root — open .env
// and paste in your own Firebase project's keys (Project settings >
// General > Your apps (Web app) in https://console.firebase.google.com/).
// No other file needs to change.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
