import { getMessaging, getToken } from "firebase/messaging";

const requestAlerts = async () => {
  try {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('./../../firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('Firebase error:', error);
  }
};

const handleAlertRequest = () => {
  requestAlerts();
};

const getTokenAndSubscribe = async () => {
  const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BDYyM6PdInPUjlyK_0VoeK9KL5W1AItdVkiBMq5f8I5yvFN_RHFjRz7mX4ahAfXb4MuXh68KUXvvvhdubLIbdao' }).then((currentToken) => {
      if (currentToken) {
        //log token to current user, or to regions notifications?
        console.log('Device Token:', currentToken);
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
};