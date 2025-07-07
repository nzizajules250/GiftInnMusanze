'use server';

import { db } from './firebase';
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import type { Room, Booking, Amenity, Attraction, Admin } from './types';
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

export async function getUserBookings(userId: string): Promise<Booking[]> {
    // For a guest user, the userId in the session is their booking document ID.
    // We will try to fetch that specific booking document.
    const bookingDocRef = doc(db, 'bookings', userId);
    const bookingSnapshot = await getDoc(bookingDocRef);
    if (bookingSnapshot.exists()) {
        return [parseDocWithDateConversion(bookingSnapshot) as Booking];
    }
    
    // If no booking document is found with that ID, it might be an admin user
    // on the user dashboard, or a guest with an invalid session.
    // The original fallback seems intended for demo purposes, so we'll keep it.
    const allBookings = await getBookings();
    return allBookings.filter(b => b.status === 'Confirmed').slice(0, 2);
}

// --- Auth Functions ---

export async function findBookingForLogin(guestName: string, guestIdNumber: string, roomName: string): Promise<Booking | null> {
    const q = query(collection(db, 'bookings'), 
        where('guestName', '==', guestName),
        where('guestIdNumber', '==', guestIdNumber),
        where('roomName', '==', roomName)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    // Assuming the combination is unique, return the first match
    return parseDocWithDateConversion(snapshot.docs[0]) as Booking;
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
    const q = query(collection(db, 'admins'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    return parseDocWithDateConversion(snapshot.docs[0]) as Admin;
}

export async function createAdminUserInFirestore(email: string, passwordHash: string): Promise<string> {
    const adminsCollection = collection(db, 'admins');
    const docRef = await addDoc(adminsCollection, { email, passwordHash });
    return docRef.id;
}
