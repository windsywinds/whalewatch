import { useState, useEffect } from 'react';
import { Auth } from './components/auth';
import { Display } from './components/Display';
import { SubmitSightings } from './components/Submit';
import { NewsDropdown, FeedbackDropdown } from './components/Dropdown';
import { AboutDropdown } from './components/Dropdown';
import { Footer } from './components/Footer';
import News from './components/News';
import Resources from './components/Resources'



import OneSignalSetup from './components/functions/OneSignalSetup'; //oneSignal webpush components
import OneSignal from 'react-onesignal';

import { initializeFirebaseMessaging } from './components/firebaseMessaging';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeComponent, setActiveComponent] = useState('display'); // Default active component
  const [deviceStyles, setdeviceStyles] = useState("hidden");
  const [isStandalonePWA, setIsStandAlone] = useState(false)



  //will set CSS according to APP vs browser (App should not display title)
  useEffect(() => {  


    //const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalonePWA) {
      // Has app installed as PWA
      setIsStandAlone(true)
        //refresh on load, else mobile PWA uses cache data
      window.addEventListener("visibilitychange", function () {
        console.log("Visibility changed");
        if (document.visibilityState === "visible") {
          console.log("APP resumed");
          window.location.reload();
        }
      });
      //set css setyle
      setdeviceStyles("hidden");
    } else {
      // It's likely a browser
      setdeviceStyles("bg-[#e8e9ff] w-full pb-2 rounded-b-[50px] shadow-lg shadow-slate-800 ");
    }
  }, []);

  


  //check if user is logged in
  useEffect(() => {

    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

    //manage user selected section to display
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="bg-[#0b0f51] text-stone-800 min-h-screen font-inter flex flex-col items-center">
      
      <div className="bg-slate-500 h-[20vw] md:h-[10vw] bg-[url('./assets/flavio-GjKPTkhni6Y-unsplash.jpg')] bg-cover shadow-2xl shadow-black flex flex-col items-center w-full justify-between z-10">
        </div>

        <div className={deviceStyles} >
        <div className="flex flex-row font-bold pb-4 pt-12 items-center justify-center">
          <p className="font-bold text-3xl underline">Whale Watch NZ </p>
          
        </div>
        </div>



        <div className="bg-[#e8e9ff] flex flex-col w-full md:w-[90%] my-4 pb-1 pt-2 rounded-[65px] my-4 shadow-lg shadow-slate-800 items-center justify-center">
        <div className="hidden md:flex items-center justify-center text-center w-[90%] h-[65px] rounded-[240px] overflow-hidden ">
      <MobileMenu handleComponentChange={handleComponentChange} />
      </div>

          {activeComponent === 'news' && <News />}
          {activeComponent === 'resources' && <Resources />}
          {activeComponent === 'display' && <Display />}
          {activeComponent === 'submit' && localStorage.getItem('isLoggedIn') === 'false' ? (
            <div className="flex items-center justify-center text-center pb-2">
              <p className="py-10">You need to login to submit a sighting!</p>
            </div>
          ) : (
            activeComponent === 'submit' && localStorage.getItem('isLoggedIn') === 'true' && <SubmitSightings />
          )}
          
        </div>
        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-[30px] my-4 shadow-lg shadow-slate-800">
          <AboutDropdown />
        </div>

        <div className="bg-[#e8e9ff] w-[90%] my-4 pb-1 pt-2 rounded-[30px] my-4 shadow-lg shadow-slate-800">
          <FeedbackDropdown />
        </div>
      
      <div>
        <Footer />
      </div>
      <div className="w-screen h-[65px] sm:h-[10vw] md:hidden fixed bottom-0 left-0 z-10">
      <MobileMenu handleComponentChange={handleComponentChange} />
      </div>

    </div>
  );
}

export default App;



const MobileMenu = ({handleComponentChange}) => {
  const [activeComponent, setActiveComponent] = useState('display');

  const handleComponentSelect = (component) => {
    handleComponentChange(component);
    setActiveComponent(component)
  };



  //it's possible to change the grid with "flex flex-col-reverse" and acheive a layout where the account is at the top. This could be used to create a vertical desktop display with the same menu aligned to the left edge of the browser, allowing for a static menu and making the center of the screen contain a permanent page with a 'map' showing sightings and other information below it.
  return(

    <div className="w-full h-full bg-[#282c34] grid grid-cols-5 divide-x border-t-2 md:border-t-0 md:border-0 text-[#e8e9ff] text-xs">
      {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
      <button className={`flex flex-col items-center ${activeComponent === 'news' ? 'bg-blue-500' : 'bg-[#282c34]'}`} onClick={() => handleComponentSelect('news')}>
      <div className="h-full flex flex-col items-center justify-center">      
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M168 80c-13.3 0-24 10.7-24 24V408c0 8.4-1.4 16.5-4.1 24H440c13.3 0 24-10.7 24-24V104c0-13.3-10.7-24-24-24H168zM72 480c-39.8 0-72-32.2-72-72V112C0 98.7 10.7 88 24 88s24 10.7 24 24V408c0 13.3 10.7 24 24 24s24-10.7 24-24V104c0-39.8 32.2-72 72-72H440c39.8 0 72 32.2 72 72V408c0 39.8-32.2 72-72 72H72zM176 136c0-13.3 10.7-24 24-24h96c13.3 0 24 10.7 24 24v80c0 13.3-10.7 24-24 24H200c-13.3 0-24-10.7-24-24V136zm200-24h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H376c-13.3 0-24-10.7-24-24s10.7-24 24-24zM200 272H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80H408c13.3 0 24 10.7 24 24s-10.7 24-24 24H200c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>
        News
      </div>
      </button>
      <button className={`flex flex-col items-center ${activeComponent === 'submit' ? 'bg-blue-500' : 'bg-[#282c34]'}`} onClick={() => handleComponentSelect('submit')}>
      <div className="h-full flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
        Submit
      </div>
      </button>
      <button className={`flex flex-col items-center ${activeComponent === 'display' ? 'bg-blue-500' : 'bg-[#282c34]'}`} onClick={() => handleComponentSelect('display')}>
      <div className="h-full flex flex-col items-center justify-center">   
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg>
        Sightings
      </div>
      </button>
      <button className={`flex flex-col items-center ${activeComponent === 'resources' ? 'bg-blue-500' : 'bg-[#282c34]'}`} onClick={() => handleComponentSelect('resources')}>
      <div className="h-full flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 192 512"><style>{`svg {fill: #ffffff;}`}</style><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"/></svg>
        Resources
      </div>
      </button>
            {/* Needs a ternary to display icon depending on !loggedIn value */}
      
      <div className="h-full flex flex-col items-center justify-center">

      <Auth />

      </div>
      
    </div>
    

  )
}