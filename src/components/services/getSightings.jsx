import { React, useState, useEffect, useRef } from "react";
import { db, auth } from '../firebase.config';
import { getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';


export async function getSightings() {
    const [activeComponent, setActiveComponent] = useState('displaylist');
    const [sightingList, setSightingList] = useState([]); // Move the data state here
    const [lastSightListUpdate, setLastSightListUpdate] = useState(null);


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
}

