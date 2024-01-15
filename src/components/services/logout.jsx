import { auth } from '../../firebase.config';
import { signOut } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';

import { notificationUnsubscribe } from './pushNotifications';


export async function logout() {
  //check if user has current alerts enabled and confirm unsubscribe
  const storedAlertSetting = localStorage.getItem('alertSettings');
  if (storedAlertSetting) {
    const isConfirmed = window.confirm('Are you sure you want to logout? This will disable any active alerts.');
    if (!isConfirmed) {
      return; // Do nothing if the user cancels the confirmation
    }
  }
  
    try {
      await signOut(auth);
      await notificationUnsubscribe() //unsubsribe from notifications
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('lastLogin');
      localStorage.removeItem('sightingList');
      localStorage.removeItem('lastSightListUpdate');    
      window.top.location = window.top.location //refresh html only
    } catch (error) {
      console.error(error);
    }
  };

  export const LogoutButton = () => {
    return(
      <button
                className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800"
                onClick={logout}
                > Log Out 
                <svg className="max-w-4 max-h-4 object-cover pl-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
              </button>
    )
  }