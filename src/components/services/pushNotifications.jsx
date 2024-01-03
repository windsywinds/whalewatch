import { getMessaging, getToken, deleteToken, onMessage } from "firebase/messaging";

import { getAuth, onAuthStateChanged, updateProfile, deleteUser, } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, increment, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.config"; // Import your Firebase configuration

//register service worker to device
export const requestAlerts = async () => {
  try {
    console.log("Requesting permission...");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      if ("serviceWorker" in navigator) {
        try {
          const firebaseConfig = encodeURIComponent(
            JSON.stringify({
              apiKey: import.meta.env.VITE_API_KEY_WWING,
              authDomain: import.meta.env.VITE_AUTH_DOMAIN,
              projectId: import.meta.env.VITE_PROJECT_ID,
              storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
              messagingSenderId: import.meta.env.VITE_MESSAGING_ID,
              appId: import.meta.env.VITE_APP_ID_WWING,
              measurementId: import.meta.env.VITE_MEASUREMENT_ID,
            })
          );
          const registration = await navigator.serviceWorker.register(
            `./firebase-messaging-sw.js?firebaseConfig=${firebaseConfig}`
          );
          console.log("Service Worker registered:", registration);
          return registration; //send confirmation back to confirm success
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    }
  } catch (error) {
    console.error("Firebase error:", error);
  }
};


//get firebase FCM token and assign token and region to user account
export const getTokenAndSubscribe = async (region, latitude, longitude, range) => {
  return new Promise(async (resolve, reject) => {
    try {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
          const { email } = user;
          const messaging = getMessaging();
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_MESSAGING_VAPID_KEY,
          });

          if (currentToken) {
            const userCollection = "whaleUsers";
            const userDocRef = doc(db, userCollection, email);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              await updateDoc(userDocRef, {
                registrationToken: currentToken,
                alertSettings: {
                  region: region,
                  alertLocation: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                   },
                  alertRange: range,
                  alertRegistrationTime: new Date(),
                },
              });

              
              const statsDocRef = doc(db, 'statistics', 'PWANotifications');

              await updateDoc(statsDocRef, {
                [`regionRegisters.${region}`]: increment(1),
                registeredUsers: increment(1),
              });

              localStorage.setItem('alertSettings', `${region}`)
              console.log("Device Token:", currentToken);
              resolve(currentToken);
              //show user confirmation of region, then reload
              const isConfirmed = window.confirm(`Notifications enabled for the ${region} region.`);
              if (isConfirmed) {
                window.top.location = window.top.location; //refresh back to display page
              }
            } else {
              console.log("User does not exist in whaleUsers collection.");
              reject(new Error("User does not exist."));
            }
          } else {
            console.log("No registration token available. Request permission to generate one.");
            reject(new Error("No registration token available."));
          }
        } else {
          console.log("User is not signed in or does not have a valid email.");
          reject(new Error("User is not signed in or does not have a valid email."));
        }
      });
    } catch (err) {
      console.log("An error occurred while retrieving token. ", err);
      reject(err);
    }
  });
};



//disable alerts by removing token and region from user account
//and remove localStorage options
export const notificationUnsubscribe = async () => {
  localStorage.removeItem("alertSettings");

  //delete users whaleUser entrys
  try {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const { email } = user;

        // Get the user document from the firestore
        const userCollection = "whaleUsers";
        const userDocRef = doc(db, userCollection, email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Remove "alertRegion" and "registrationToken" from the user document
          await updateDoc(userDocRef, {
            registrationToken: null,
            alertRegion: null,
          });

          // Delete the service worker's registration token
          const messaging = getMessaging();
          const currentToken = await getToken(messaging, {
            vapidKey: "BDYyM6PdInPUjlyK_0VoeK9KL5W1AItdVkiBMq5f8I5yvFN_RHFjRz7mX4ahAfXb4MuXh68KUXvvvhdubLIbdao",
          });
          if (currentToken) {
            await deleteToken(messaging, currentToken);
          }

          //remove service worker?

          // if ("serviceWorker" in navigator) {
          //   const registrations = await navigator.serviceWorker.getRegistrations();
          //   registrations.forEach((registration) => {
          //     registration.unregister();
          //   });
          // }


          console.log("Unsubscribed from notifications.");
        } else {
          console.log("User does not exist in whaleUsers collection.");
        }
      } else {
        console.log("User is not signed in or does not have a valid email.");
      }
    });
  } catch (err) {
    console.error("An error occurred while unsubscribing:", err);
  }
  
};
