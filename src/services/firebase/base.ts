import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_SENDER_ID,
  FIREBASSE_BUCKET,
} from '@constants/config';
import firebase, { FirebaseApp } from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries

const APP_NAME = 'generative-app';

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASSE_BUCKET,
  messagingSenderId: FIREBASE_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const getFirebaseApp = (): FirebaseApp => {
  let firebaseApp: FirebaseApp;
  // Check if Firebase app with name "APP_NAME" exists
  try {
    firebaseApp = firebase.getApp(APP_NAME);
  } catch (err: unknown) {
    //  Create a new one
    firebaseApp = firebase.initializeApp(firebaseConfig, APP_NAME);
  }
  return firebaseApp;
};

export default getFirebaseApp;
