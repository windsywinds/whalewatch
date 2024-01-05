import { useState, useEffect } from "react";
import React from 'react'
import { db, auth } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import mapboxgl from 'mapbox-gl';



export const SubmitSightings = () => {
  const [type, setType] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("Species");
  const [speciesOptions, setSpeciesOptions] = useState();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [region, setRegion] = useState("Unknown"); //Sets 'Unknown' as default region, when app is ready for national coverage, handleSubmit can be updated to allow other regions
  const [currentTime, setCurrentTime] = useState("");
  const [count, setCount] = useState(1); //count is number of times a user has 'confirmed' sighting, default is 1 for submitter
  const [formError, setFormError] = useState("");




  useEffect(() => {
    const getCurrentTime = () => {
      const currentDateTime = new Date();
      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false, // 24-hour format
        timeZone: "UTC", // Format time as UTC
      };
      const currentTime = currentDateTime.toLocaleString("en-NZ", options);
      setCurrentTime(currentTime);
    };

    getCurrentTime();
  }, []);

  const [displayTime, setDisplayTime] = useState(new Date().toLocaleString("en-NZ"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayTime(new Date().toLocaleString("en-NZ"));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    let species = selectedSpecies

    if (selectedSpecies === "Species") {
      species = "Unknown"
    }
  
      //check all fields have been filled
    if (!type || !latitude || !longitude) {
      setFormError("Please fill in all fields.");
      return;
    }

    //restrict the regions in which the user can submit sightings
    if (region === "Unknown") {
      setFormError("Sorry, we're not able to identify this region, please check the location is correct.");
      return;
    }
  
    try {
      let collectionRef = collection(db, "sightings");  
  
        //define all the fields for the entry
      const newSighting = {
        type,
        species,
        region,
        count,
        firstSighted: new Date(),
        time: new Date(),
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        userSubmitted: auth.currentUser.uid, // Add userUID field
        userConfirmed: [auth.currentUser.uid]
      };
  
      await addDoc(collectionRef, newSighting);

      
  

  
      setType("");
      setSelectedSpecies("");
      setLatitude("");
      setLongitude("");
      setRegion("");
      setFormError("");
      setCount(+1)
  
      console.log("Sighting submitted successfully!");
      localStorage.removeItem('sightingList'); //remove users current sighting data so their sighting is updated
      window.location.reload(); //reload switches user to the 'display' component to view sightings
    } catch (error) {
      console.error("Error submitting sighting:", error);
    }
  };
  
  


  useEffect(() => {
    const mapBoundry = [
      [164.134207, -47.566660], // Southwest coordinates 
      [179.698107, -33.888934] // Northeast coordinates
    ];

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false,
    });

      //reverse look up the lat+long to find the name of the area user has selected
    const reverseGeocode = async (lngLat) => {
      const [longitude, latitude] = lngLat;
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      const place = data.features[0];
      const region = place.context.find((context) => context.id.includes('region'));
      setRegion(region ? region.text : 'Unknown');
    };

    // Create a marker variable
let marker = new mapboxgl.Marker({ color: 'blue'});

map.on('load', () => {
  map.addControl(new mapboxgl.NavigationControl());
  

  // Retrieve user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude.toFixed(6));
        setLongitude(longitude.toFixed(6));
        setFormError("");

        // Set map center to user's location
        map.setCenter([longitude, latitude]);
        map.setZoom(12);

        // Update the marker with the user's location
        marker.setLngLat([longitude, latitude]).addTo(map);
        map.setMaxBounds(mapBoundry);

        reverseGeocode([longitude, latitude]);
      },
      (error) => {
        console.error("Error getting GPS location:", error);
        setFormError("Failed to retrieve GPS location. Please enable location services.");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    setFormError("Geolocation is not supported on this device, or location services are turned off.");
  }
});

map.on('click', (e) => {
  const { lng, lat } = e.lngLat;
  setLatitude(lat.toFixed(6));
  setLongitude(lng.toFixed(6));

  // Update the marker with the clicked location
  marker.setLngLat([lng, lat]).addTo(map);

  reverseGeocode([lng, lat]);
});


    return () => map.remove();
  }, []);


  
  const whaleSpecies = ["Blue Whale", "Beaked Whale", "Bryde's Whale", "False Killer Whale", "Fin Whale", "Humpback", "Minke Whale", "Pilot Whale", "Southern right/tohorā", "Sperm Whale", "Toothed Whale", "Other Species"]
  const dolphinSpecies = ["Bottle Nose", "Common dolphin", "Dusky", "Hector", "Maui", "Orca", "Other Species"]
  const penguinSpecies = ["Fiordland crested penguin", "Little (blue) penguin", "Yellow-eyed penguin"]
  
  
  //When user selects animal type, then set possible species options
  useEffect(() => {
    let selection = ''
    if (type === "Whale") {
      selection = whaleSpecies
    }
    if (type === "Dolphin") {
      selection = dolphinSpecies
    }
    if (type === "Penguin") {
      selection = penguinSpecies
    }
    setSpeciesOptions(selection)
  }, [type])
  

  return (
    <div className="rounded-xl overflow-hidden pb-4">
      <div className="flex items-center justify-center flex-col text-center pt-5 pb-8 pl-10 pr-10">
        <p className="text-sm mb-5 font-bold">Submit a sighting!</p>
        <p className="text-sm md:mx-20 md:px-20">
          Select the animal you've seen and then tap the animals rough location on the map. You'll need to allow the app access to your location in order to submit a sighting!
        </p>
      </div>

      

      <form className="w-full flex flex-col items-center justify-center " onSubmit={handleSubmit}>
        <div className="flex w-[85%] flex-col md:flex-col px-2 items-center justify-center ">
          <div className="flex flex-col md:flex-row justify-center items-center my-2 ">
            
            
            <div className="md:mr-2 mb-2 md:mb-0 ">
              <select
                className="w-full md:w-auto px-2 py-2 bg-slate-300 rounded-xl"
                placeholder="Select Animal Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Animal</option>
                <option value="Whale">Whale</option>
                <option value="Dolphin">Dolphin</option>
                <option value="Shark">Shark</option>
                <option value="Penguin">Penguin</option>
                <option value="Leopard Seal">Leopard Seal</option>
              </select>
            </div>
            {type && speciesOptions ? (
  <div className="md:mr-2 mb-2 md:mb-0 ">
    <select
      className="w-full md:w-auto px-2 py-2 bg-slate-300 rounded-xl"
      placeholder="Select Animal SubType"
      value={selectedSpecies}
      onChange={(e) => setSelectedSpecies(e.target.value)}
    >
      <option value="Species" readOnly>Species</option>
      <option value="Unknown">Unknown</option>

      {speciesOptions.map((species) => (
        <option key={species} value={species}>
          {species}
        </option>
      ))}
    </select>
  </div>
) : null}

{type && type === "Whale" ? (
  <div className="md:mr-2 mb-2 md:mb-0 text-xs">
    <p>Looking for Orca? They're part of the dolphin family!</p>
  </div>
    ) : null}

            
            
            <div className="justify-center items-center md:mr-2 mb-2 md:mb-0 ">  
            <input
              id="region-input"
              className="px-2 py-2 w-full md:w-auto bg-slate-300 rounded-xl"
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              readOnly
            />
            </div>
            
            
          </div>
          <div className="border-slate-300 rounded-md border-4 h-52 w-full  justify-center items-center ">
            <div id="map" className="h-full"></div>
            </div>
          

          <div className="flex flex-col pt-2 md:flex-row">
            <input
              className="pl-2 py-2 mb-2 md:mb-0 md:mr-2 w-full md:w-auto bg-slate-300 rounded-xl"
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              readOnly
            />
            <input
              className="pl-2 py-2 w-full md:w-auto bg-slate-300 rounded-xl"
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              readOnly
            />
          </div>
        </div>
        <p>Submission time: {displayTime}</p>

        {formError && <p className="text-red-500">{formError}</p>}
        <div className="pt-2">
          <button
            type="submit"
            className="whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-8000"
          >
            Thar she blows!
          </button>
        </div>
      </form>
    </div>
  );
};
