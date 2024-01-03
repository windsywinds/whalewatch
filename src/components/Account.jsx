import { auth } from '../firebase.config';
import { useState, useEffect, useRef } from 'react';


import { requestAlerts, getTokenAndSubscribe, notificationUnsubscribe } from './services/pushNotifications';
import { LogoutButton } from "./services/logout";
import { DeleteUserAccount } from "./services/deleteUser";

import shareIcon from '../assets/ios-share.svg'
import androidDots from '../assets/android-dots.svg'

import { AdminPanel } from './services/adminPanel';
const authUser = import.meta.env.VITE_AUTH_USER

export const AccountPage = ( ) => {
  const [alertsEnabaled, setAlertsEnabled] = useState(false)
  const [storedAlertSetting, setStoredAlertSetting] = useState();
  const [isPWA, setIsPWA] = useState(false);

useEffect(() => {
  const storedIsPWA = window.matchMedia('(display-mode: standalone)').matches;
  if (storedIsPWA) {
    setIsPWA(true);
  } else { 
    setIsPWA(false);
  }
}, []);

  useEffect(() => {
    const storedSetting = localStorage.getItem('alertSettings');
    if (storedSetting && storedSetting !== "null") {
      //use localstorage
      setStoredAlertSetting(storedSetting);
      setAlertsEnabled(true)
      console.log("Using local storage data for alert settings:", storedSetting);
    } else {
      //can't verify users settings
      console.log("Cannot verify alerts settings.")
    }

  }, []);

  //request alert permission => set alert options display
  const setPermissions = async (e) => {
    e.preventDefault()
    try {
        //call push notification requests to register service worker
        const registration = await requestAlerts();

        //then if registration === valid display alert options
        if (registration) {
            setAlertsEnabled(true);
        } else {
     //you need to enable notifications!
        }
    } catch (error) {
      console.log("Error registering:", error)
    }
  }
  const disableAlerts = async (e) => {
    e.preventDefault()
    try {
      await notificationUnsubscribe()
      setAlertsEnabled(false);
      setStoredAlertSetting()
    } catch (error) {
      console.log("Error disabling alerts:", error)
    }
  }

    return(

        <div className="flex flex-col text-center pb-2">
          <p className="text-lg px-2 pb-6 my-auto">
              Welcome,&nbsp;<span className="font-bold">{auth.currentUser.email ? auth.currentUser.email : 'Guest'}</span>
            </p>

            {isPWA && storedAlertSetting && storedAlertSetting !== "null" && (
              <p className="flex w-full pb-2 items-center justify-center">
              Alerts are currently enabled for the &nbsp;
              <span className="underline">{storedAlertSetting}</span>&nbsp; region.
            </p>
            )}
            {isPWA ? (<p className="flex w-full py-2 items-center justify-center">If you're having issues with alerts, please try disabling them, logging out, and then delete and reinstall the app to reset it. If problems persist, please get in touch using the feedback section. </p>
            ) : (
              <div className="flex flex-col w-full">
              <p className="flex flex-row w-full py-2 items-center justify-center"> Push notificatons can be enabled here when using the app. </p>
              <div className="flex flex-col w-full items-center justify-center">
              <p className="flex flex-row w-2/3 py-4 items-center justify-center leading-8"> 
              Apple users: Select the share icon and scroll down to find "Add to Homescreen"</p>
              <img className="px-4 w-auto h-full" src={shareIcon} />
                </div>
                <div className="flex flex-col w-full items-center justify-center">
              <p className="flex flex-row w-2/3 py-2 items-center justify-center leading-8"> 
              Android users: In the top right, select the menu icon and then "Install app"</p> 
             <img className="px-4 w-auto h-full" src={androidDots} />
              </div>
              </div>
            ) }


            {!storedAlertSetting && alertsEnabaled && <div className="flex w-full py-1 items-center justify-center">
                <SetUserAlertLocation /> 
            </div>}

            <div className="flex flex-row mt-2 justify-center items-center ">
            {isPWA && !alertsEnabaled ? (
            <button
                className="flex flex-row  items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800 gap-2"
                onClick={setPermissions}> 
                Enable Alerts 
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg>
          </button>
          ) : isPWA ? (
            <button
            className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800 gap-2"
            onClick={disableAlerts}> 
            Disable Alerts 
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1.5em" viewBox="0 0 448 512">Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V51.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM406.2 416L160 222.1v4.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S115.4 416 128 416H406.2zm-40.9 77.3c12-12 18.7-28.3 18.7-45.3H320 256c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /> </svg>
      </button>

          ) : null}
          </div>
          <div>
          {authUser === auth.currentUser.email && <AdminPanel />}
        </div>

<div className="flex flex-row mt-4 justify-between items-center">
            <div className="flex  items-end justify-end">
              <DeleteUserAccount />
            </div>
            <div className="flex  items-end justify-end">
              <LogoutButton />
            </div>
          </div>


            


        </div>
    )
  }

//set users location via map
import mapboxgl from 'mapbox-gl';
export const SetUserAlertLocation = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedRegion, setRegion] = useState("Unknown"); //Sets 'Unknown' as default region
  const [selectedRange, setSelectedRange] = useState(20);
  const [formError, setFormError] = useState("");
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);


  useEffect(() => {
    const mapBoundry = [
      [164.134207, -47.566660],
      [179.698107, -33.888934]
    ];
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
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

    mapInstance.on('load', () => {
      mapInstance.addControl(new mapboxgl.NavigationControl());

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude.toFixed(6));
            setLongitude(longitude.toFixed(6));
            mapInstance.setCenter([longitude, latitude]);
            mapInstance.setZoom(8);
            mapInstance.setMaxBounds(mapBoundry);

            reverseGeocode([longitude, latitude]);
          },
          (error) => {
            console.error("Error getting GPS location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    });

    // Save the map instance in the ref
    mapRef.current = mapInstance;

    // Cleanup function to remove the map instance when the component is unmounted
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current;    

    // Add pins to the map using the data from props (sightingList)
    const addPinToMap = () => {
      
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      
      function createCustomMarkerElement(map) {
        const container = document.createElement('div');
        const radiusInMeters = selectedRange * 1000; // 20 kilometers
      
        // Calculate the size based on the current map bounds
        const calculatePixelSize = (radiusInMeters, map) => {
          const center = map.getCenter();
      
          // Calculate the distance in pixels using the initial zoom level
          const metersPerPixel =
            40075016.686 * Math.abs(Math.cos((center.lat * Math.PI) / 180)) /
            Math.pow(2, map.getZoom() + 8);
          const pixelSize = (radiusInMeters / metersPerPixel) * 4; //4 not 2 appears to be more accurate?
      
          return pixelSize;
        };
      
        // Initialize the marker without the map reference
        const radiusElement = document.createElement('div');
        container.appendChild(radiusElement);
      
        // Set the initial size based on the initial zoom level
        const initialSize = calculatePixelSize(radiusInMeters, map);
        radiusElement.style.width = `${initialSize}px`; // Diameter
        radiusElement.style.height = `${initialSize}px`; // Diameter
        radiusElement.style.borderRadius = '50%';
        radiusElement.style.border = '4px solid #fff';
        radiusElement.style.position = 'absolute';
        radiusElement.style.zIndex = '1';
        radiusElement.style.backgroundColor = '#21a1f1';
        radiusElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        radiusElement.style.top = '50%';
        radiusElement.style.left = '50%';
        radiusElement.style.transform = 'translate(-50%, -50%)';
        radiusElement.style.opacity = '0.3';
      
        const backgroundElement = document.createElement('div');
        backgroundElement.style.width = '20px'; // Adjust the size as needed
        backgroundElement.style.height = '20px'; // Adjust the size as needed
        backgroundElement.style.borderRadius = '50%'; // Make it a circle
        backgroundElement.style.position = 'absolute';
        backgroundElement.style.zIndex = '2';
        backgroundElement.style.backgroundColor = '#fff';
        backgroundElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add drop shadow
        container.appendChild(backgroundElement);
      
        const pulsatingElement = document.createElement('div');
        pulsatingElement.style.width = '20px'; // Adjust the size as needed
        pulsatingElement.style.height = '20px'; // Adjust the size as needed
        pulsatingElement.style.borderRadius = '50%'; // Make it a circle
        pulsatingElement.style.position = 'relative';
        pulsatingElement.style.zIndex = '9';
        pulsatingElement.style.animation = 'pulse 2.5s infinite'; // Apply pulsating animation
        pulsatingElement.style.backgroundColor = '#21a1f1';
        pulsatingElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        container.appendChild(pulsatingElement);
      
        // Update the size whenever the map is zoomed
        map.on('zoom', () => {
          const newSize = calculatePixelSize(radiusInMeters, map);
          radiusElement.style.width = `${newSize}px`;
          radiusElement.style.height = `${newSize}px`;
        });
      
        container.classList.add('custom-marker-container');
      
        return container;
      }

      markerRef.current = new mapboxgl.Marker({ element: createCustomMarkerElement(map) })
      .setLngLat([longitude, latitude])
      .addTo(map);
    };

    // Call addPinToMap when selectedRange changes
    addPinToMap();
    
  }, [selectedRange, longitude, latitude]);



  const validRegions = ["Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay", "Manawatū-Whanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Waikato", "Wellington", "West Coast"];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validRegions.includes(selectedRegion)) {
      setFormError("Sorry, we're not able to identify this region, please check the location is correct.");
      return;
    }
    try {
      const range = parseInt(selectedRange, 10); //sets distance for user to be alerted about sightings
      const confirmRegion = await getTokenAndSubscribe(selectedRegion, latitude, longitude, range);
      console.log("Alerts set to token", confirmRegion)
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  return(
    <div>

<form className="w-full flex flex-col items-center justify-center " onSubmit={handleSubmit}>
        <div className="flex w-[85%] flex-col md:flex-col px-2 items-center justify-center ">
          <div className="flex flex-col md:flex-row justify-center items-center my-2 ">

            <div className="flex flex-row gap-2 ">
            <select className="px-2 py-2  w-1/3 bg-slate-300 rounded-xl"  
              value={selectedRange}
              onChange={(e) => {setSelectedRange(e.target.value)}}>
              <option disabled value="Select Range">Select Range</option>
              <option value={5}>5km</option>
              <option value={10}>10km</option>
              <option value={15}>15km</option>
              <option value={20}>20km</option>
              <option value={25}>25km</option>
              <option value={30}>30km</option>

              
            </select>
         
          
            <input
              id="region-input"
              className="px-2 py-2 w-auto bg-slate-300 rounded-xl"
              type="text"
              placeholder="Region"
              value={selectedRegion}
              onChange={(e) => setRegion(e.target.value)}
              readOnly
            />
              </div>
            
            
          </div>
          <div className="border-slate-300 rounded-md border-4 h-52 w-full  justify-center items-center ">
            <div id="map" className="h-full"  ref={mapContainerRef}></div>
            </div>
          

          <div className="flex flex-row pt-2 gap-2 ">
            <input
              className="pl-2 py-2 w-1/2 bg-slate-300 rounded-xl"
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              readOnly
            />
            <input
              className="pl-2 py-2 w-1/2 bg-slate-300 rounded-xl"
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              readOnly
            />
          </div>
        </div>
       

        {formError && <p className="text-red-500">{formError}</p>}
        <div className="pt-2">
          <button
            type="submit"
            className="whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-colors duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-8000"
          >
            Set My Location
          </button>
        </div>
      </form>

    </div>
  )
}


export const AlertPanel = () => {
  const [selectedRegion, setSelectedRegion] = useState("Select Region")


    const onSetAlertsButton = async (e) => {
      e.preventDefault()
      if (selectedRegion === "Select Region") {
        console.log("Please select a valid region");
        return; // Prevent the form submission
      }
      try{ 
        const confirmRegion = await getTokenAndSubscribe(selectedRegion);
        console.log("Alerts set to token", confirmRegion)
        setSelectedRegion("Select Region")
      } catch (error) {
        console.log("Error setting alerts:", error)
      }

    }

    return(
      <div className="flex flex-row gap-2">
        <div>
          
          <div className="flex flex-row gap-2">
            <form className="flex flex-row gap-6"
              onSubmit={onSetAlertsButton}>
            
        <button
                className="flex flex-row items-center justify-center whitespace-nowrap button-72 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-xl py-2 px-4 transition-all duration-400 ease-in-out drop-shadow-sm shadow-sm shadow-slate-800 gap-2"> 
                Set Alert Region
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg>
          </button>
          </form>
          
    </div>

          
          
          
        </div>

        

      </div>
    )
  }
