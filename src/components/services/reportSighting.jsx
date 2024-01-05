import { db, auth } from '../../firebase.config';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';

//for users to report incorrect sightings
//e.g. if a user has submitted a false sighting
//or has incorrectly listed the animal/species

export async function reportSighting() {


  try {
    
  } catch (error) {
    console.error(error);
  }
}

export const ReportSightingButton = () => {

  return (
    
  );
};
