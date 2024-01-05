import { db, auth, googleProvider } from '../firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInWithPopup, signInAnonymously,  signOut, signInWithRedirect } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, addDoc, getDoc, getDocs, collection, updateDoc, where, query } from 'firebase/firestore';

import fbicon from '../assets/fb.png';
import googleicon from '../assets/google.png';
import guestIcon from '../assets/user-icon.svg'
import mailIcon from '../assets/mail-icon.svg'

import { AccountPage } from './Account'



import { logout } from './services/logout';



export const Auth = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const loginDropDownRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [showUserPage, setShowUserPage] = useState(false);
  const accountDropDownRef = useRef(null);


    //close the login prompt if the user clicks outside the login box
    const handleClickOutside = (event) => {
      if (loginDropDownRef.current && !loginDropDownRef.current.contains(event.target)) {
        setShowDropdown(false);
      } else if (accountDropDownRef.current && !accountDropDownRef.current.contains(event.target)) {
        setShowUserPage(false);
      }
    };
    


  const createWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
      }
      setLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      checkAuthState();
      setShowDropdown(false)
    } catch (error) {
      console.error(error);
    }
  };

const signInWithEmail = async () => {

  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if the user exists and the credentials are correct
    if (user) {
      // Call the onLogin() method to handle the successful login
      setLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      checkAuthState();
      setShowDropdown(false)
    } else {
      console.log('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
  }
};


  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      checkAuthState();
      setShowDropdown(false)
    } catch (error) {
      console.error(error);
    }
  };

  //sign in as guest
  const signAnon = async () => {
    try {
      await signInAnonymously(auth);
      setLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setShowDropdown(false)
    } catch (error) {
      console.error(error);
    }
  };

  const logoutClick = async () => {
    try {
      setLoggedIn(false);
      setShowUserPage(false);
      logout()
    } catch (error) {
      console.error(error);
    }
  };

  //if the user does not exist in the database, create an entry for them to track logins and submissions 
  //if they do exist, add to "timesLoggedIn" count to track the number of times the user has logged into the website
  //and update any localStorage data such as alert regions
  const submitUser = async (userUID, email) => {
    const currentTime = new Date()
    const lastLoginTime = localStorage.getItem('lastLogin');
    if (!lastLoginTime || currentTime - new Date(lastLoginTime) >= 24 * 60 * 60 * 1000) {
      console.log('Last Login greater than 24hours, logging user:', userUID);
      try {
        const userCollection = email ? 'whaleUsers' : 'whaleGuests';
        const userRef = collection(db, userCollection);
        const querySnapshot = await getDocs(query(userRef, where('userUID', '==', userUID)));
    
        let userExists = false;
        let userDocId = null;
        let alertsRegion = null;
    
        querySnapshot.forEach((doc) => {
          userExists = true;
          userDocId = doc.id;
  
          //if user has previously set an alertRegion, set this to local storage
          const userData = doc.data();
          if (userData.alertRegion && userData.alertRegion !== null) {
            alertsRegion = userData.alertRegion;
            console.log('User alertRegion found:', alertsRegion);
            localStorage.setItem('alertSettings', alertsRegion);
          }
          
        });
    
        if (userExists) {
          const userDocRef = doc(db, userCollection, userDocId);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
    
          if (email && userData.email !== email && userData.altEmail !== email) {
            await updateDoc(userDocRef, {
              altEmail: email,
              lastLoggedIn: new Date(),
            });
          }
    
          if (userUID && userData.userUID === userUID) {
            await updateDoc(userDocRef, {
              timesLoggedIn: (userData.timesLoggedIn || 0) + 1,
              lastLoggedIn: new Date(),
            });
          }
  
        } else {
          if (email) {
            const docRef = doc(db, userCollection, email);
            const docSnap = await getDoc(docRef);
    
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                userUID,
                email,
                lastLoggedIn: new Date(),
              });
            }
          } else {
            await addDoc(userRef, {
              userUID,
              lastLoggedIn: new Date(),
            });
          }
        }
        localStorage.setItem('lastLogin', currentTime.toISOString());
        console.log('User logged successfully!', userUID);
      } catch (error) {
        console.error("Error with user login:", error);
      }
    } else {
      console.log('Last Login less than 24hours, not logging user:', userUID);
      return
    }
  };

  
  const checkAuthState = async () => {
    try {
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(resolve, reject);
        return () => unsubscribe();
      });

      if (user) {
        setLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        submitUser(user.uid, user.email);
        console.log('UserUID logged in:', user.uid);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };
  
  
  useEffect(() => {
    checkAuthState();
  
    // Other useEffect cleanup or dependencies, if needed
  }, []);
  


  useEffect(() => { //Handle click outside user Login dropdown box
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {loggedIn && !auth.currentUser.email ? (
      
      <button
      className="w-full h-full  flex flex-col items-center" 
      onClick={logoutClick}> 
      <div className="h-full flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"> Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
    Log Out 
    </div>
    </button>
      
      ) : loggedIn && auth.currentUser.email ? (

        <button className="w-full h-full  flex flex-col items-center" onClick={() => {setShowUserPage(!showUserPage)}}>        
          <div className="h-full flex flex-col items-center justify-center">
          <svg height="2em" viewBox="0 0 512 512">
    <style>{`svg {fill: #ffffff;}`}</style><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" /></svg>
      Options
        </div>
        </button>

   

      ) : (
        
        <button className="w-full h-full  flex flex-col items-center" onClick={() => {setShowDropdown(!showDropdown)}}>        
          <div className="h-full flex flex-col items-center justify-center">
          <svg height="2em" viewBox="0 0 512 512">
    <style>{`svg {fill: #ffffff;}`}</style><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" /></svg>
      Login
        </div>
        </button>
      )}

          {showDropdown && (
            <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-95 text-black">
            <div className="bg-white border border-gray-300 rounded-xl shadow p-5 w-full max-w-xl"  ref={loginDropDownRef}>
              <div className="text-center pb-4">
                <p>Sign in with:</p>
              </div>
              <button
                className="w-full flex items-center pl-2 pr-2 py-4 hover:bg-gray-100"
                onClick={signInWithGoogle}
              >
                <img src={googleicon} className="max-w-4 max-h-4 object-cover pr-2" alt="Google icon" /> Google
              </button>
              <p
                className="w-full flex items-center pl-2 pr-2 py-4 bg-gray-300 text-slate-400"
              >
                <img src={fbicon} className="max-w-4 max-h-4 object-cover pr-2 " alt="Facebook icon" /> Facebook (currently unavailable)
              </p>
              <button
                className="w-full flex items-center pl-2 pr-2 py-4 hover:bg-gray-100"
                onClick={signAnon}
              >
                <img src={guestIcon} className="max-w-4 max-h-4 object-cover pr-2" alt="guest icon"/> Guest Login
              </button>
              <p
                className="w-full flex items-center pl-2 pr-2 py-4"
              >
                <img src={mailIcon} className="max-w-4 max-h-4 object-cover pr-2" alt="email icon"/> Sign in / Sign up with email:
              </p>
              <div className="flex flex-col pb-0">
                <div className="pb-2">
                  <input
                    className="bg-slate-200 rounded-xl pl-2 outline-none w-full py-2"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="pb-2">
                  <input
                    className="bg-slate-200 rounded-xl pl-2 outline-none w-full py-2"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-row pt-3">
                  <div className="pr-3">
                    <button
                      className="flex items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out shadow-sm"
                      onClick={createWithEmail}
                    >
                      Create Account
                    </button>
                  </div>
                  <div className="pl-3">
                    <button
                      className="flex items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out shadow-sm"
                      onClick={signInWithEmail}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
            
          )}

          {showUserPage && (
                      <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-95 text-black">
                      <div className="bg-white border border-gray-300 rounded-xl shadow p-5 w-full max-w-xl" ref={accountDropDownRef}>
          <AccountPage />
          
          </div></div>
          ) }
        
      
    </div>
  );
};

