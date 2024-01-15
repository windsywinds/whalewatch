import { React, useState, useEffect, useRef } from "react";
import { db, auth } from '../firebase.config';
import { getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';

import { DisplayList } from "./displayresults/displaylist";
import { DisplayMap } from "./displayresults/displaymap";

import { Sightings } from "./displayresults/Sightings";

import helpIcon from '../assets/circle-question.svg'

// This page will handle which version the user wants to display the results. 
// DisplayList will show results in list form. 
// DisplayMap will provide results on a Map with less details to visualize location sightings

export const Display = () => {
  const [activeComponent, setActiveComponent] = useState('displaylist');
  const [sightingList, setSightingList] = useState([]); // Move the data state here
  const [lastSightListUpdate, setLastSightListUpdate] = useState(null);
  const [showUpdateHelp, setShowUpdateHelp] = useState(false);
  const helpRef = useRef(null);

  //close help ref on click outside
  const handleClickOutside = (event) => {
    if (helpRef.current && !helpRef.current.contains(event.target)) {
      setShowUpdateHelp(false);
  };}
  useEffect(() => { //Handle click outside help box
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  useEffect(() => {
    const storedSightingList = localStorage.getItem('sightingList');
    const lastSightListUpdate = localStorage.getItem('lastSightListUpdate');
    setLastSightListUpdate(lastSightListUpdate)

    const getSightingList = async () => {
      try {
        // Fetch data from the database
        const sightingsQuery = query(collection(db, "sightings"), orderBy("time", "desc"));
        const sightingsSnapshot = await getDocs(sightingsQuery);
        const combinedData = sightingsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setSightingList(combinedData);
        console.log("New Data Retrieved")
        localStorage.setItem('sightingList', JSON.stringify(combinedData));
        
        const currentDate = new Date();
        setLastSightListUpdate(currentDate);
        localStorage.setItem('lastSightListUpdate', currentDate);
      } catch (error) {
        console.error(error);
      }
    };

    const isUpdateNeeded = !lastSightListUpdate || new Date() - new Date(lastSightListUpdate) > 5 * 60 * 1000;

    if (storedSightingList && !isUpdateNeeded) {
      setSightingList(JSON.parse(storedSightingList));
      console.log('Using local storage data from:', lastSightListUpdate);
    } else {
      console.log('Retrieving new data');
      getSightingList();
    }
  }, []);
  

  return (
    <div className="rounded-md overflow-hidden pb-10">
      <div className="flex items-center justify-center flex-col text-center pt-5 pb-8 mx-4 sm:mx-8 md:mx-16 lg:mx-24">
        <p className="text-sm mb-2 font-bold">Latest sightings reported</p>
        <p className="text-sm">
        All the sightings here are reported by individual users, so accuracy can't be guaranteed. Any sightings in the last 30 minutes will be shown with the time in green; however, be aware the animal may have already left the area by the time you arrive. If you do manage to spot one, help verify the sighting so others know it's genuine by clicking the 'confirm' button, and this will update the time sighted! If the animal has moved on, you can submit a new entry for the new location!
        </p>
        {lastSightListUpdate &&
        <div className="flex w-full justify-end">
        <p className="flex flex-row gap-4  text-xs mt-2 sm:mr-8">
          Next results update: {
            new Date(new Date(lastSightListUpdate).getTime() + 5 * 60 * 1000).toLocaleString("en-NZ", {
              hour: "numeric",
              minute: "numeric"
            })}
          {' '}
          <img src={helpIcon}
            onClick={() => setShowUpdateHelp(!showUpdateHelp)}
            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          />
        </p>
        {showUpdateHelp && 
        <p className="bg-yellow-200 rounded-xl drop-shadow-lg absolute text-xs px-6 py-6" ref={helpRef}>The current sighting data will refresh every 5 minutes, and was lasted updated at {new Date(lastSightListUpdate).toLocaleString("en-NZ", {
          hour: "numeric",
          minute: "numeric"
        })}. </p>
        }
      </div>
      }
      </div>

      <div className="flex flex-row justify-evenly items-center space-x-4 py-8 sm:py-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeComponent === 'displaylist' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
          }`}
          onClick={() => handleComponentChange('displaylist')}
        >
          Display as List
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeComponent === 'displaymap' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-300'
          }`}
          onClick={() => handleComponentChange('displaymap')}
        >
          Display as Map
        </button>
      </div>

      {activeComponent === 'displaylist' && <DisplayList sightingList={sightingList} />} 
      {activeComponent === 'displaymap' && <DisplayMap sightingList={sightingList} />} 
    </div>
  );
};
