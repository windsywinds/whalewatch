import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { auth } from "../../firebase.config";

const GREEN_COLOR_CLASS = "#10B981";
const ORANGE_COLOR_CLASS = "#F59E0B";
const RED_COLOR_CLASS = "#EF4444";
const GRAY_COLOR_CLASS = "#cdcdcd";

export const DisplayMap = ({ sightingList }) => {
  const mapContainerRef = useRef(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("All");
  const [confirmedSightings, setConfirmedSightings] = useState([]);

  useEffect(() => {
    const mapBoundry = [
      [164.134207, -47.566660], // Southwest coordinates 
      [179.698107, -33.888934] // Northeast coordinates
    ];
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    map.on('load', () => {
      map.addControl(new mapboxgl.NavigationControl());

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude.toFixed(6));
            setLongitude(longitude.toFixed(6));
            map.setCenter([longitude, latitude]);
            map.setZoom(9);
            map.setMaxBounds(mapBoundry);
          },
          (error) => {
            console.error("Error getting GPS location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    });

    // Add pins to the map using the data from props (sightingList)
    const addPinsToMap = () => {
      const sortedSightingList = [...sightingList].slice(0, 20) //limit to latest 20 entries


      //reverse order so the first entry gets placed last, and will appear as top pin
      sortedSightingList.reverse().forEach((sighting) => {
        const { latitude, longitude } = sighting.location;
        const currentTime = new Date().getTime();
        
        const sightingTime = new Date(sighting.time.seconds * 1000);
        const timeDifference = Math.floor(
          (new Date().getTime() - sightingTime.getTime()) / (1000 * 60)
        );


        let colorClass = GRAY_COLOR_CLASS; //older than 24 hours
        let sizeClass = 1;

        if (timeDifference <= 29) { //up to 29 minutes 
          colorClass = GREEN_COLOR_CLASS;
          sizeClass = 2;
        } else if (timeDifference >= 30 && timeDifference <= 59) {//0.5-1 hours
          colorClass = ORANGE_COLOR_CLASS;
          sizeClass = 1;
        } else if (timeDifference >= 60 && timeDifference <= 1440) { //1-24 hours
          colorClass = RED_COLOR_CLASS;
          sizeClass = 1;
        }

        const formattedTime = sightingTime.toLocaleString("en-NZ", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        });
    
        const popupContent = `
          <p><strong>Animal:</strong> ${sighting.type}</p>
          ${sighting.species && sighting.species != "Unknown"  ? `<p><strong>Species:</strong> ${sighting.species}</p>` : ''}
          <p><strong>Region:</strong> ${sighting.region}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Sightings:</strong> ${sighting.count}</p>
          <a       
            href=https://www.google.com/maps/search/?api=1&query=${sighting.location.latitude},${sighting.location.longitude}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps ⤤
          </a>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);


        new mapboxgl.Marker({ "color": colorClass, "scale": sizeClass })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map);
      });
    };

    // Call addPinsToMap when sightingList changes
    addPinsToMap();

  }, [selectedRegionFilter, sightingList]);

  useEffect(() => {
    if (auth.currentUser) {
      const userUID = auth.currentUser.uid;
      const confirmedSightings = sightingList
        .filter((sighting) => sighting.userConfirmed.includes(userUID))
        .map((sighting) => sighting.id);
      setConfirmedSightings(confirmedSightings);
    }
  }, [sightingList]);

  return (
    <div>
      <div className="flex h-[200px] md:h-[400px] justify-center ">
        <div id="map" className="h-full border-slate-300 rounded-md border-4 w-[90%] " ref={mapContainerRef}></div>
      </div>
    </div>
  );
};
