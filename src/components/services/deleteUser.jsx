import { db, auth } from '../../firebase.config';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';

export async function deleteWhaleUser() {
  try {
    const user = auth.currentUser;

    // Ask for confirmation before proceeding
    const isConfirmed = window.confirm('Are you sure you want to delete your account? This action is irreversible.');

    if (!isConfirmed) {
      return; // Do nothing if the user cancels the confirmation
    }

    // Delete user account from the 'whaleUsers' collection
    if (user) {
      const userCollection = 'whaleUsers';
      const userDocRef = doc(db, userCollection, user.email);

      // Check if the document exists before attempting to delete
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        await deleteDoc(userDocRef);
      }
    }

    // Delete user from Firebase Authentication
    await deleteUser(user);
    // Sign out the user
    await signOut(auth);

    // Clear local storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('alertSettings');
    localStorage.removeItem('lastLogin');
    window.top.location = window.top.location; // refresh HTML only
  } catch (error) {
    console.error(error);
  }
}

export const DeleteUserAccount = () => {
  return (
    <button
      className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-700 text-slate-200 hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800"
      onClick={deleteWhaleUser}
    >
      Delete Account
      <svg className="max-w-4 max-h-4 object-cover pl-2" xmlns="http://www.w3.org/2000/svg" height="1em" width="2em" viewBox="0 0 512 512">
        Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
      </svg>
    </button>
  );
};
