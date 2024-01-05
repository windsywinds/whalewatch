import { useState, useEffect } from "react";
import { db, auth } from "../../firebase.config";
import { updateDoc, doc } from 'firebase/firestore';

const GREEN_COLOR_CLASS = 'text-green-500';
const ORANGE_COLOR_CLASS = 'text-orange-500';
const RED_COLOR_CLASS = 'text-red-500';

export const DisplayList = ({ sightingList }) => { // Receive data as props
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("All");
  const [confirmedSightings, setConfirmedSightings] = useState([]);
  
  const handleRegionFilterSelection = (filter) => {
    setSelectedRegionFilter(filter);
  };
  
  useEffect(() => {
    if (auth.currentUser) {
      const userUID = auth.currentUser.uid;
      const confirmedSightings = sightingList.filter(sighting => sighting.userConfirmed.includes(userUID)).map(sighting => sighting.id);
      setConfirmedSightings(confirmedSightings);
    }
  }, [sightingList]);

  const handleConfirmClick = async (sightingId) => {
    const isConfirmed = window.confirm(`Please make sure you are currently viewing the animal when you confirm the sighting as this updates the time of the listing!`);
              if (isConfirmed) {
    try {
      const sightingRef = doc(db, "sightings", sightingId);
      const sighting = sightingList.find((sighting) => sighting.id === sightingId);
      const isConfirmed = confirmedSightings.includes(sightingId);
  
      const updatedCount = isConfirmed ? sighting.count - 1 : sighting.count + 1;
      const updatedUserConfirmed = isConfirmed
        ? sighting.userConfirmed.filter((uid) => uid !== auth.currentUser.uid)
        : [...sighting.userConfirmed, auth.currentUser.uid];
  
      await updateDoc(sightingRef, {
        count: updatedCount,
        time: new Date(),
        userConfirmed: updatedUserConfirmed,
      });
  
      if (isConfirmed) {
        setConfirmedSightings((prevConfirmedSightings) =>
          prevConfirmedSightings.filter((id) => id !== sightingId)
        );
      } else {
        setConfirmedSightings((prevConfirmedSightings) => [...prevConfirmedSightings, sightingId]);
      }
    } catch (error) {
      console.error(error);
    }
  }}
  
  // Add the missing variable definition for filteredSightingList
  const filteredSightingList = selectedRegionFilter === "All"
    ? [...sightingList.slice(0, 10)] // Limit to 10 entries
    : sightingList.filter((sighting) => sighting.region === selectedRegionFilter).slice(0, 10); // Limit to 10 entries



  return (
    <div className="flex flex-col items-center">


      <div className="flex flex-row sm:flex-row items-center space-y-0 space-x-2 my-4 mx-2">
        <div className="py-2 px-2">
          <select
            value={selectedRegionFilter}
            onChange={(e) => handleRegionFilterSelection(e.target.value)}
            className="border border-slate-800 px-2 py-1 rounded-md"
          >
            <option value="All">All</option>
            {[...new Set(sightingList.map((sighting) => sighting.region))].map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-evenly text-center invisible md:visible">
  <div className="w-[90%]">
    <table className="w-full table-fixed">
      <thead>
        <tr>
          <th className="w-1/6">Region</th>
          <th className="w-1/6 pr-9">Animal</th>
          <th className="w-1/6">Time Sighted</th>
          <th className="w-1/6"># of Sightings</th>
          <th className="w-1/6"></th>
          <th className="w-1/6 pr-5">Confirm Sighting?</th>
        </tr>
      </thead>
    </table>
  </div>
</div>
      <div className="w-full">
  {filteredSightingList.map((sighting, index) => {
    const time = new Date(sighting.time.seconds * 1000);
    const timeDifference = Math.floor(
      (new Date().getTime() - time.getTime()) / (1000 * 60)
    );

    let textColorClass = RED_COLOR_CLASS;
    if (timeDifference <= 29) {
      textColorClass = GREEN_COLOR_CLASS;
    } else if (timeDifference >= 30 && timeDifference <= 59) {
      textColorClass = ORANGE_COLOR_CLASS;
    }

    const formattedTime = time.toLocaleString("en-NZ", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });

    return (
      <div key={index} className="flex flex-col justify-center items-center py-2">
        <div key={sighting.id} className="flex flex-col md:flex-row pb-5 pt-5 justify-between items-center text-center bg-[#c1c4ff] w-[85%] rounded-2xl shadow-lg shadow-slate-800">
          
        <p className="md:hidden font-bold">Region:</p>
        <div className="px-4 md:py-2 py-0">{sighting.region && sighting.region}</div>
        <p className="md:hidden font-bold">Animal:</p>
        <div className="px-4 md:py-2 py-0">{sighting.type}{sighting.species && sighting.species != "Unknown" ? `,  ${sighting.species}` : null}</div>
        <p className="md:hidden font-bold">Time sighted:</p>
        <div className={`px-4 md:py-2 py-0 ${textColorClass}`}>{formattedTime}</div>
        <p className="md:hidden font-bold">Number of confirmations:</p>
        <div className="px-4 md:py-2 py-0">{sighting.count && sighting.count}</div>
        <div className="px-4 md:py-2 py-0">
          <a
            className="underline"
            href={`https://www.google.com/maps/search/?api=1&query=${sighting.location.latitude},${sighting.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps ⤤
          </a>
        </div>
        <p className="md:hidden font-bold">Confirm sighting?</p>
        <div className="px-4 md:py-2 py-1">
          <button
            id="confirm"
            onClick={() => handleConfirmClick(sighting.id)}
            className={`ml-2 ${
              confirmedSightings.includes(sighting.id) ? 'bg-green-600' : 'bg-blue-500'
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            style={{ opacity: confirmedSightings.includes(sighting.id) ? 1 : 1 }}
          >
            {confirmedSightings.includes(sighting.id) ? 'Confirmed' : 'Confirm'}
          </button>
        </div>
       
      </div>
      </div>
    );
  })}
</div>

    </div>
  );
};

