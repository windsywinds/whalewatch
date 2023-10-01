import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { auth } from "../../firebase.config";

const GREEN_COLOR_CLASS = "#10B981";
const ORANGE_COLOR_CLASS = "#F59E0B";
const RED_COLOR_CLASS = "#EF4444";

export const DisplayMap = ({ sightingList }) => {
  const mapContainerRef = useRef(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("All");
  const [confirmedSightings, setConfirmedSightings] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoid2luZHN5d2luZHMiLCJhIjoiY2xmbTY1N2R6MDh3YTQxcGk3MDR6emdzaCJ9.S25LVqE01kz3WrxWIjbrRA";

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
      const sortedSightingList = [...sightingList].sort(
        (a, b) => a.time.seconds - b.time.seconds //sort pins and display newest pins on top
      );

      sortedSightingList.forEach((sighting) => {
        const { latitude, longitude } = sighting.location;
        const currentTime = new Date().getTime();
        
        const sightingTime = new Date(sighting.time.seconds * 1000);
        const timeDifference = Math.floor(
          (new Date().getTime() - sightingTime.getTime()) / (1000 * 60)
        );
        

        let colorClass = RED_COLOR_CLASS;
        let sizeClass = 1;

        if (timeDifference <= 29) {
          colorClass = GREEN_COLOR_CLASS;
          sizeClass = 2;
        } else if (timeDifference >= 30 && timeDifference <= 59) {
          colorClass = ORANGE_COLOR_CLASS;
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
