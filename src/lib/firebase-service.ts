'use server';

import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Room, Booking, Amenity, Attraction } from './types';
import { Wifi, Dumbbell, Waves, Utensils, Sparkles, Building, Trees, ShoppingBag, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const getIcon = (iconName: string): LucideIcon => {
    const iconMap: { [key: string]: LucideIcon } = {
        Waves,
        Dumbbell,
        Sparkles,
        Utensils,
        Building,
        Trees,
        ShoppingBag,
        MapPin,
        Wifi,
    };
    return iconMap[iconName] || Wifi;
};

const parseDocWithDateConversion = (doc: any) => {
    const data = doc.data();
    for (const key in data) {
        if (data[key] && typeof data[key].toDate === 'function') {
            data[key] = data[key].toDate();
        }
    }
    return { id: doc.id, ...data };
};

export async function getRooms(): Promise<Room[]> {
  const roomsCollection = collection(db, 'rooms');
  const roomsSnapshot = await getDocs(roomsCollection);
  const roomsList = roomsSnapshot.docs.map(doc => parseDocWithDateConversion(doc));
  return roomsList as Room[];
}

export async function getAmenities(): Promise<Amenity[]> {
    const amenitiesCollection = collection(db, 'amenities');
    const amenitiesSnapshot = await getDocs(amenitiesCollection);
    const amenitiesList = amenitiesSnapshot.docs.map(doc => {
        const data = parseDocWithDateConversion(doc) as any;
        return {
            ...data,
            icon: getIcon(data.icon),
        };
    });
    return amenitiesList as Amenity[];
}

export async function getAttractions(): Promise<Attraction[]> {
    const attractionsCollection = collection(db, 'attractions');
    const attractionsSnapshot = await getDocs(attractionsCollection);
    const attractionsList = attractionsSnapshot.docs.map(doc => {
         const data = parseDocWithDateConversion(doc) as any;
         return {
            ...data,
            icon: getIcon(data.icon),
         }
    });
    return attractionsList as Attraction[];
}

export async function getBookings(): Promise<Booking[]> {
    const bookingsCollection = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsCollection);
    const bookingsList = bookingsSnapshot.docs.map(doc => parseDocWithDateConversion(doc));
    return bookingsList as Booking[];
}

// In a real app, you would filter by an authenticated user's ID.
// For this demo, we'll simulate fetching bookings for a specific user.
export async function getUserBookings(): Promise<Booking[]> {
    const allBookings = await getBookings();
    // Assuming a hardcoded user for demo purposes
    const userBookings = allBookings.filter(b => b.guestName === "Alex Doe");
    if (userBookings.length > 0) {
        return userBookings;
    }
    // Fallback to show some data if the user has no bookings
    return allBookings.filter(b => b.status === 'Confirmed').slice(0, 2);
}
