import { React, useState, useEffect } from "react";
import { db, auth } from '../firebase.config';
import { getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';

import { DisplayList } from "./displayresults/displaylist";
import { DisplayMap } from "./displayresults/displaymap";

// This page will handle which version the user wants to display the results. DisplayList will show results in list form. DisplayMap will provide results on a Map with less details to visualize location sightings

export const Display = () => {
  const [activeComponent, setActiveComponent] = useState('displaylist');
  const [sightingList, setSightingList] = useState([]); // Move the data state here

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  // Move the data retrieval logic to useEffect
  useEffect(() => {
    const getSightingList = async () => {
      try {
        const sightingsQuery = query(collection(db, "sightings"), orderBy("time", "desc"));
        const sightingsSnapshot = await getDocs(sightingsQuery);
        const combinedData = sightingsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setSightingList(combinedData);
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = onSnapshot(collection(db, "sightings"), () => {
      getSightingList();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="rounded-md overflow-hidden pb-10">
      <div className="flex items-center justify-center flex-col text-center pt-5 pb-8 pl-10 pr-10">
        <p className="text-sm mb-2 font-bold">Latest sightings reported</p>
        <p className="text-sm md:mx-20 md:px-20">
        All the sightings here are reported by individual users, so accuracy can't be guaranteed. Any sightings in the last 30 minutes will be shown with the time in green; however, be aware the animal may have already left the area by the time you arrive. If you do manage to spot one, help verify the sighting so others know it's genuine by clicking the 'confirm' button, and this will update the time sighted! If the animal has moved on, you can submit a new entry for the new location!
        </p>
      </div>

      <div className="flex flex-row justify-evenly items-center space-x-4 py-6 sm:py-4">
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

      {activeComponent === 'displaylist' && <DisplayList sightingList={sightingList} />} {/* Pass the data as props */}
      {activeComponent === 'displaymap' && <DisplayMap sightingList={sightingList} />} {/* Pass the data as props */}
    </div>
  );
};
