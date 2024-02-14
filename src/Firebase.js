import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQ9XQ9lf0ADR329-nd1IgD3C5CCnGJtnw",
  authDomain: "sasuga-d222e.firebaseapp.com",
  projectId: "sasuga-d222e",
  storageBucket: "sasuga-d222e.appspot.com",
  messagingSenderId: "451516213776",
  appId: "1:451516213776:web:c9742cb3eb5236bbd7b895",
  measurementId: "G-27TMFDSPBZ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);

const messaging = getMessaging();

export { auth, db, messaging };

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BO_pl85MXO5Bj3S9aTK2jm5sL8lBXnN2-zcRNHm_HNt6eQmE5KC0vMLeDpIuR8h3WY-1bMOhW8vsVG72loSQgiQ",
    });

    if (currentToken) {
      console.log("Current token for client: ", currentToken);

      const adminDocRef = doc(db, "admin", "TLEgZhqA6Mh4N1uhc6cguKmMoI63");
      const docSnapshot = await getDoc(adminDocRef);

      if (docSnapshot.exists()) {
        await updateDoc(adminDocRef, {
          token: currentToken,
          timestamp: new Date(),
        });
        console.log(
          "Token document updated with ID: TLEgZhqA6Mh4N1uhc6cguKmMoI63"
        );
      } else {
        await setDoc(adminDocRef, {
          id: "TLEgZhqA6Mh4N1uhc6cguKmMoI63",
          token: currentToken,
          timestamp: new Date(),
        });
        console.log(
          "Token document added with ID: TLEgZhqA6Mh4N1uhc6cguKmMoI63"
        );
      }
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.error(
      "An error occurred while retrieving or storing the token: ",
      err
    );
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Recived Notification -> " + payload.notification.title);
      resolve(payload);
    });
  });
