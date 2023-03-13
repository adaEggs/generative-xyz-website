// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyC714xG1hU1OTRoCdrwPLwnTWK2mspCW3Q",
  authDomain: "generative-365207.firebaseapp.com",
  projectId: "generative-365207",
  storageBucket: "generative-365207.appspot.com",
  messagingSenderId: "456784877308",
  appId: "1:456784877308:web:8580becd2c6c01e6342979"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { data } = payload;
  const { title, body, icon } = data;
  // Customize notification here
  const notificationTitle = title;
  const notificationOptions = {
    body,
    icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener('notificationclick', event => {
//   console.log(event)
// });
