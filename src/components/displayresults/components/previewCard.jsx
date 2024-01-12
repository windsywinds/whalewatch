import { useState, useEffect } from "react";
import { db, auth } from "../../../firebase.config";
import { updateDoc, doc } from 'firebase/firestore';

const GREEN_COLOR_CLASS = 'text-green-500';
const ORANGE_COLOR_CLASS = 'text-orange-500';
const RED_COLOR_CLASS = 'text-red-500';

export const PreviewCard = ({ sighting }) => {
  const [confirmedSightings, setConfirmedSightings] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const userUID = auth.currentUser.uid;
      const confirmedSightings = sighting.userConfirmed.includes(userUID) ? [sighting.id] : [];
      setConfirmedSightings(confirmedSightings);
    }
  }, [sighting]);

  const handleConfirmClick = async (sightingId) => {
    const isConfirmed = window.confirm(`Please make sure you are currently viewing the animal, as this updates the time of the listing!`);
    if (isConfirmed) {
      try {
        const sightingRef = doc(db, "sightings", sightingId);
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

        setConfirmedSightings(isConfirmed
          ? confirmedSightings.filter((id) => id !== sightingId)
          : [...confirmedSightings, sightingId]
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

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
    <div key={sighting.id} className="flex flex-col justify-center items-center py-2">
        
      <div className="flex flex-col py-4 px-4 justify-between items-center text-center bg-[#c1c4ff] w-[85%] rounded-2xl shadow-lg shadow-slate-500">
        <p className=" font-bold">Region:</p>
        <div className="px-4 md:py-2 py-0">{sighting.region && sighting.region}</div>
        <p className=" font-bold">Animal:</p>
        <div className="px-4 md:py-2 py-0">{sighting.type}{sighting.species && sighting.species !== "Unknown" ? `,  ${sighting.species}` : null}</div>
        <p className=" font-bold">Last sighted:</p>
        <div className={`px-4 md:py-2 py-0 ${textColorClass}`}>{formattedTime}</div>
        <p className=" font-bold">Number of confirmations:</p>
        <div className="px-4 md:py-2 py-0">{sighting.userConfirmed && sighting.userConfirmed.length}</div>
        <div className="flex flex-row w-full justify-between gap-2">
              
        
          <button
            id="confirm"
            onClick={() => handleConfirmClick(sighting.id)}
            className={`${
              confirmedSightings.includes(sighting.id) ? 'bg-green-600' : 'bg-blue-500'
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            style={{ opacity: confirmedSightings.includes(sighting.id) ? 1 : 1 }}
          >
            {confirmedSightings.includes(sighting.id) ? 'Time Updated' : 'Update Time'}
          </button>
          <button
            className={` bg-blue-500
            hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          
          >
            Update Details
          </button>
          <a
            className={` bg-blue-500
              hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
              
            href={`https://www.google.com/maps/search/?api=1&query=${sighting.location.latitude},${sighting.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps ⤤
          </a>
        </div>
      </div>
    </div>
  );
};
