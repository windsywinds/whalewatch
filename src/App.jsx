import { useState, useEffect } from 'react';
import { Auth } from './components/auth';
import  Intro   from './components/Intro';
import { Display } from './components/Display';
import { SubmitSightings } from './components/Submit';
import { NewsDropdown, FeedbackDropdown } from './components/Dropdown';
import { AboutDropdown } from './components/Dropdown';
import { Footer } from './components/Footer';
import News from './components/News';
import Resources from './components/Resources'
import { initializeFirebaseMessaging } from './components/firebaseMessaging';

import { MobAuth } from './components/auth';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeComponent, setActiveComponent] = useState('display'); // Default active component
  const [deviceStyles, setdeviceStyles] = useState("hidden");

  useEffect(() => {
    if (Notification.permission === 'granted') {
    initializeFirebaseMessaging();
    } else {
      console.log("Permission denied")
    }
  }, []);

  const onSetAlertsButton = (e) => {
    e.preventDefault();
    if ('serviceWorker' in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          initializeFirebaseMessaging();
        } else {
          console.log("User denied permissions")
        }
      }) 
  }}

  //will set CSS according to APP vs browser (App should not display title)
  useEffect(() => {
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalonePWA) {
      // Has app installed as PWA
      setdeviceStyles("hidden");
    } else {
      // It's likely a browser
      setdeviceStyles("bg-[#e8e9ff] w-[90%] my-4 pb-2 rounded-xl shadow-lg shadow-slate-800");
    }
  }, []);



  //check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

    //manage user selected section to display
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="bg-[#0b0f51] text-stone-800 min-h-screen font-inter flex flex-col items-center">
      <div className="bg-slate-500 h-[20vw] md:h-[10vw] bg-[url('./assets/flavio-GjKPTkhni6Y-unsplash.jpg')] bg-cover shadow-2xl shadow-black flex flex-col items-center w-screen justify-between">
        <div className="w-full">
          <Auth onLogin={handleLogin} onLogout={handleLogout} />
        </div>
        </div>

        <div className={deviceStyles} >
        <div className="flex flex-row font-bold pb-4 pt-5 items-center justify-center">
          <p className="font-bold text-3xl underline">Whale Watch NZ </p>
          
        </div>
        </div>



        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <div className="flex flex-col sm:flex-row justify-evenly space-x-1 px-1 sm:space-x-4 my-4">
          <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'news' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('news')}
            >
              News and Updates
            </button>
            <div className="flex flex-row justify-between items-center space-x-4 py-2 sm:py-0">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'display' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('display')}
            >
              Latest Sightings
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'submit' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('submit')}
            >
              Submit Sighting
            </button>
            </div>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeComponent === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
              }`}
              onClick={() => handleComponentChange('resources')}
            >
              Resources
            </button>
          </div>

          {activeComponent === 'news' && <News />}
          {activeComponent === 'resources' && <Resources />}
          {activeComponent === 'display' && <Display />}
          {activeComponent === 'submit' && !isLoggedIn && (
            <div className="flex items-center justify-center text-center pb-2">
              <p className="py-10">You need to login to submit a sighting!</p>
            </div>
          )}
          {activeComponent === 'submit' && isLoggedIn && <SubmitSightings />}
        </div>
        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <AboutDropdown />
        </div>

        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-2xl my-4 shadow-lg shadow-slate-800">
          <FeedbackDropdown />
        </div>
      
      <div>
        <Footer />
      </div>

      <MobileMenu  onLogin={handleLogin} onLogout={handleLogout} handleComponentChange={handleComponentChange} />

    </div>
  );
}

export default App;



const MobileMenu = ({ onLogin, onLogout, handleComponentChange}) => {
  const showLogin = true;


  //will need to create function above sent down
  const handleUserSelection = (component) => {
    handleComponentChange(component);
  };

  return(
    <>
    <div className="w-full h-[15vw] bg-[#282c34] sticky bottom-0 left-0 z-10 grid grid-cols-5 divide-x border-t-2 text-white">
      {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
      <button className="flex flex-col" onClick={() => handleComponentChange('news')}>
      <div className="h-full flex flex-col items-center justify-center">      
      <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M168 80c-13.3 0-24 10.7-24 24V408c0 8.4-1.4 16.5-4.1 24H440c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H168zM72 480c-39.8 0-72-32.2-72-72V112C0 98.7 10.7 88 24 88s24 10.7 24 24V408c0 13.3 10.7 24 24 24s24-10.7 24-24V104c0-39.8 32.2-72 72-72H440c39.8 0 72 32.2 72 72V408c0 39.8-32.2 72-72 72H72zM176 136c0-13.3 10.7-24 24-24h96c13.3 0 24 10.7 24 24v80c0 13.3-10.7 24-24 24H200c-13.3 0-24-10.7-24-24V136zm200-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zM200 272H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>
        News
      </div>
      </button>
      <button className="flex flex-col" onClick={() => handleComponentChange('submit')}>
      <div className="h-full flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
        Submit
      </div>
      </button>
      <button className="flex flex-col" onClick={() => handleComponentChange('display')}>
      <div className="h-full flex flex-col items-center justify-center">   
      <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>
        Sightings
      </div>
      </button>
      <button className="flex flex-col" onClick={() => handleComponentChange('resources')}>
      <div className="h-full flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 192 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"/></svg>
        Resources
      </div>
      </button>
            {/* Needs a ternary to display icon depending on !loggedIn value */}
      <button className="flex flex-col">
      <div className="h-full flex flex-col items-center justify-center">
      {showLogin &&
          <div className="h-full flex flex-col items-center justify-center">
          <svg height="1.5em" viewBox="0 0 512 512">
    <style>{`svg {fill: #ffffff;}`}</style><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" /></svg>
      Account
        </div>}
        {!showLogin &&
          <div className="h-full flex flex-col items-center justify-center">
          <svg height="1.5em" viewBox="0 0 512 512">
    <style>{`svg {fill: #ffffff;}`}</style><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" /></svg>
      Login
        </div>}
      </div>
      </button>
    </div>
    
    </>
  )
}