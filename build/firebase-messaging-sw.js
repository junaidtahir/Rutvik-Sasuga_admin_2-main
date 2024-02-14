// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAMssagdbrPN-1skl1zlw_xeEYPSxDAVQY",
  authDomain: "fir-project-e61c0.firebaseapp.com",
  databaseURL: "https://fir-project-e61c0-default-rtdb.firebaseio.com",
  projectId: "fir-project-e61c0",
  storageBucket: "fir-project-e61c0.appspot.com",
  messagingSenderId: "164315725737",
  appId: "1:164315725737:web:89e321b25548baa21f8eb8"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
