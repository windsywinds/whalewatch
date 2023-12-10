// OneSignalSetup.js

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

async function OneSignalSetup() {
    OneSignal.init({
        appId: 'e4652d85-f51c-4c0c-b544-4c29300374c5',
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerPath: './../../OneSignalSDKWorker.js', // Update the path based on your project structure
      })
        .then(() => {
          OneSignal.Slidedown.promptPush();
          console.log('OneSignal initialized successfully');
        })
        .catch((error) => {
          console.error('Error initializing OneSignal:', error);
        });

};

export default OneSignalSetup;
