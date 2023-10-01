import { auth, googleProvider } from '../firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInWithPopup, signInAnonymously,  signOut, signInWithRedirect } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, addDoc, getDoc, getDocs, collection, updateDoc, where, query } from 'firebase/firestore';
import { db } from '../firebase.config';
import fbicon from '../assets/fb.png';
import googleicon from '../assets/google.png';

export const Auth = ({ onLogin, onLogout }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

    //close the login prompt if the user clicks outside the login box
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const createWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
      }
      onLogin();
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
      onLogin();
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
      onLogin();
    } catch (error) {
      console.error(error);
    }
  };

  const signAnon = async () => {
    try {
      await signInAnonymously(auth);
      onLogin();
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      onLogout();
      setShowDropdown(false);
    } catch (error) {
      console.error(error);
    }
  };

  //if the user does not exist in the database, create an entry for them to track logins and submissions 
  //if they do exist, add to "timesLoggedIn" count to track the number of times the user has logged into the website
  const submitUser = async (userUID, email) => {
    try {
      const userCollection = email ? 'whaleUsers' : 'whaleGuests';
      const userRef = collection(db, userCollection);
      const querySnapshot = await getDocs(query(userRef, where('userUID', '==', userUID)));
  
      let userExists = false;
      let userDocId = null;
  
      querySnapshot.forEach((doc) => {
        userExists = true;
        userDocId = doc.id;
      });
  
      if (userExists) {
        const userDocRef = doc(db, userCollection, userDocId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
  
        if (email && userData.email !== email && userData.altEmail !== email) {
          await updateDoc(userDocRef, {
            altEmail: email,
          });
        }
  
        if (userUID && userData.userUID === userUID) {
          await updateDoc(userDocRef, {
            timesLoggedIn: (userData.timesLoggedIn || 0) + 1,
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
            });
          }
        } else {
          await addDoc(userRef, {
            userUID,
          });
        }
      }
  
      console.log('User logged successfully!', userUID);
    } catch (error) {
      console.error(error);
    }
  };
  
  
    
  
  

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        submitUser(user.uid, user.email);
        console.log('UserUID logged in:', user.uid);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => { //user Login drop downbox click away
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap md:flex-row justify-end items-center my-auto mx-auto py-auto px-auto">
      {loggedIn ? (
        <>
          <p className="pr-2 my-auto">
            Welcome, {auth.currentUser.email ? auth.currentUser.email : 'Guest'}
          </p>
          <div className="mr-2 mt-2">
          <button
              className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800"
              onClick={logout}
            > Log Out 
              <svg className="max-w-4 max-h-4 object-cover pl-2" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"> Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
            </button>
          </div>
        </>
      ) : (
        <div className="relative pr-2 pt-2" >
          <button
            className="flex flex-row items-center justify-center whitespace-nowrap bg-blue-500  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            User Login
          </button>
          {showDropdown && (
            <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-95">
              <div className=" bg-white border border-gray-300 rounded-xl shadow px-5 py-5 " ref={dropdownRef}>
                <div className="text-center pb-4"><p> Sign in with:</p></div>
              <button
                className="w-full flex items-center pl-2 pr-2 py-4 hover:bg-gray-100"
                onClick={signInWithGoogle}
              >
                <img src={googleicon} className="max-w-4 max-h-4 object-cover pr-2" /> Google
              </button>
              <p
                className="w-full flex items-center pl-2 pr-2 py-4 bg-gray-300"
                
              >
                <img src={fbicon} className="max-w-4 max-h-4 object-cover pr-2" /> Facebook
              </p>
              <button
                className="w-full flex items-center pl-2 pr-2 py-4 hover:bg-gray-100"
                onClick={signAnon}
              >
                <svg className="max-w-4 max-h-4 object-cover pr-2"  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>Guest Login
              </button>
              <p
                className="w-full flex items-center pl-2 pr-2 py-4"
              >
                <svg className="max-w-4 max-h-4 object-cover pr-2"  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.<path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>Sign in / Sign up with email:
              </p>
              <div className="flex flex-col pb-0">
               <div className="pb-2 ">
               <input className="bg-slate-200 rounded-xl pl-2 outline-none items-center justify-center w-full py-2"
               placeholder="Enter  email"
               onChange={(e) => setEmail(e.target.value)} />
               </div>
                <div className="">
                <input className="bg-slate-200 rounded-xl pl-2 outline-none items-center justify-center w-full py-2"
                placeholder="Enter  password" 
                onChange={(e) => setPassword(e.target.value)} />
                
               </div>
                <div className="flex flex-row pt-3">
                <div className="pr-3">
                <button className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800" 
              onClick={createWithEmail}>
                Create Account</button>
                </div>
                <div className="pl-3">
                <button className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800" 
              onClick={signInWithEmail}>
                Sign In</button>
                </div>
                </div>
            </div>
            </div>
              </div>
            
          )}
        </div>
      )}
    </div>
  );
};
