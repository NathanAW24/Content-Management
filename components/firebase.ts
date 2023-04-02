// import {  } from "firebase-admin";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log(firebaseConfig);
export default app;

// sign in using auth

// console.log("test", "test");
const auth = getAuth(app);
// console.log("auth", auth);
async function asyncSignIn() {
  await signInWithEmailAndPassword(
    auth,
    process.env.NEXT_PUBLIC_FIREBASE_USER_AUTH_EMAIL as string,
    process.env.NEXT_PUBLIC_FIREBASE_USER_AUTH_PASSWORD as string,
  )
    .then((userCredential) => {
      console.log('signed in!');
    })
    .catch((err: Error) => {
      console.log(err);
    });
}
asyncSignIn();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
