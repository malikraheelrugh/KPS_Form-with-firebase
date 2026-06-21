# Student Enrollment Form

A React + Tailwind CSS form that collects a student's name, father's name,
registration number, class, and phone number, validates that every field is
filled in, and saves the record to a Cloud Firestore database.

## Quick start

1. Extract the zip.
2. Open a terminal in the extracted folder and run:
   ```bash
   npm install
   ```
3. Add your Firebase project keys to the **`.env`** file (see below) — this
   is the only file you need to touch.
4. Run:
   ```bash
   npm run dev
   ```
   and open the printed `localhost` URL.

Steps 2 and 3 are unavoidable for any Firebase app: `node_modules` is never
shipped inside source code (you install it locally), and a database
connection always needs *your own* private project credentials — no one
else can supply those for you.

## Connecting your Firebase project (2 minutes)

1. Go to the [Firebase console](https://console.firebase.google.com/) and
   create a project (or use an existing one).
2. Click **Build → Firestore Database → Create database** (start in test
   mode for local development).
3. Go to **Project settings → General → Your apps**, add a **Web app**, and
   copy the `firebaseConfig` values it shows you.
4. Open the **`.env`** file in the project root and paste them in:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. Restart `npm run dev` (Vite only reads `.env` on startup).

Until you do this, the form still renders and validates correctly, but
shows a small "Setup needed" banner and submissions will fail since there's
nothing to save to yet.

Submitted records appear in Firestore under a `students` collection, each
with `studentName`, `fatherName`, `registrationNumber`, `studentClass`,
`phoneNumber`, and a `createdAt` server timestamp.

## Before going to production: lock down Firestore

Test mode allows anyone to read/write your database. Before launching,
tighten the rules in **Firestore → Rules**, for example to only allow
writes (and not arbitrary reads) on the `students` collection:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{docId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

Adjust this to fit your actual access needs (e.g. require Firebase
Authentication for reads if staff need to view submissions).

## How validation works

- Every field is required; trying to submit an empty field shows
  "This field is required." beneath it.
- The phone number must be 7-15 characters of digits, spaces, `+`, or `-`.
- The registration number must be 3-20 letters, numbers, or hyphens.
- Names must be at least 2 characters.
- Errors appear after a field is blurred (or on submit) and clear as soon
  as the input becomes valid.
- The submit button is disabled while the record is being saved, and a
  confirmation screen appears once it's written to Firestore.

## Project structure

```
src/
├── firebase.js              # Firebase app + Firestore initialization
├── App.jsx                  # Renders the form
├── main.jsx                 # React entry point
├── index.css                # Tailwind directives
└── components/
    └── StudentForm.jsx      # The form, validation, and live ID preview
```
