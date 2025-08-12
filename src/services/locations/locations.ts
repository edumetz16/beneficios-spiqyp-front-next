import { db } from "../firestore/firestore";

export type Location = {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
};

export const getLocations = async (locationRefs?: string[]): Promise<Location[]> => {
  let locations: Location[] = [];
  
  if (locationRefs && locationRefs.length > 0) {
    for (const locationRef of locationRefs) {
      try {
        const location = await db.doc(locationRef).get();
        if (location.exists) {
          locations.push({
            id: location.id,
            ...location.data()
          } as Location);
        }
      } catch (error) {
        console.error(`Error fetching location ${locationRef}:`, error);
      }
    }
  } else {
    // Get all locations if no refs provided
    try {
      const locationsSnapshot = await db.collection('locations').get();
      locations = locationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Location));
    } catch (error) {
      console.error('Error fetching all locations:', error);
    }
  }

  return locations;
};

export const getLocationById = async (locationId: string): Promise<Location | null> => {
  try {
    const location = await db.doc(`locations/${locationId}`).get();
    if (location.exists) {
      return {
        id: location.id,
        ...location.data()
      } as Location;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching location ${locationId}:`, error);
    return null;
  }
}; 