import { db } from './firebase';
import { collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import type { Room, Booking, Amenity, Attraction, Admin, SessionPayload } from './types';
import { getIcon } from './icons';

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

export async function getRoomById(id: string): Promise<Room | null> {
    const roomDocRef = doc(db, 'rooms', id);
    const roomSnapshot = await getDoc(roomDocRef);
    if (!roomSnapshot.exists()) {
        return null;
    }
    return parseDocWithDateConversion(roomSnapshot) as Room;
}

export async function getAmenities(): Promise<(Amenity & { iconName: string })[]> {
    const amenitiesCollection = collection(db, 'amenities');
    const amenitiesSnapshot = await getDocs(amenitiesCollection);
    const amenitiesList = amenitiesSnapshot.docs.map(doc => {
        const data = parseDocWithDateConversion(doc) as any;
        return {
            ...data,
            iconName: data.icon,
            icon: getIcon(data.icon),
        };
    });
    return amenitiesList as (Amenity & { iconName: string })[];
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

export async function getUserBookings(session: SessionPayload | null): Promise<Booking[]> {
    if (!session) {
        return [];
    }

    if (session.role === 'admin') {
        // Admins use the admin dashboard, they don't have personal user bookings.
        return [];
    }

    // For a guest user, the userId in the session is their booking document ID.
    const bookingDocRef = doc(db, 'bookings', session.userId);
    const bookingSnapshot = await getDoc(bookingDocRef);
    if (bookingSnapshot.exists()) {
        return [parseDocWithDateConversion(bookingSnapshot) as Booking];
    }
    
    // Fallback if guest's booking is not found
    return [];
}


export async function getUserProfile(session: SessionPayload) {
    if (session.role === 'admin') {
        const adminDocRef = doc(db, 'admins', session.userId);
        const adminSnapshot = await getDoc(adminDocRef);
        if (adminSnapshot.exists()) {
            const adminData = adminSnapshot.data() as Admin;
            return {
                name: "Administrator",
                email: adminData.email,
                avatar: "https://placehold.co/100x100.png"
            }
        }
    }
    
    if (session.role === 'guest') {
        const bookingDocRef = doc(db, 'bookings', session.userId);
        const bookingSnapshot = await getDoc(bookingDocRef);
        if (bookingSnapshot.exists()) {
            const bookingData = bookingSnapshot.data() as Booking;
            return {
                name: bookingData.guestName,
                email: "Guest Account",
                avatar: "https://placehold.co/100x100.png"
            }
        }
    }

    // Fallback for not found user
    return {
        name: "Unknown User",
        email: "",
        avatar: "https://placehold.co/100x100.png"
    }
}


// --- Auth & Booking Functions ---

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

type NewBookingData = Omit<Booking, 'id'>;

export async function createBooking(bookingData: NewBookingData): Promise<string> {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, bookingData);
    return docRef.id;
}

// Admin management functions

export async function saveRoom(room: Omit<Room, 'id'> & { id?: string }) {
    if (room.id) {
        const roomDocRef = doc(db, 'rooms', room.id);
        const { id, ...roomData } = room;
        await setDoc(roomDocRef, roomData);
    } else {
        await addDoc(collection(db, 'rooms'), room);
    }
}

export async function deleteRoom(roomId: string) {
    await deleteDoc(doc(db, 'rooms', roomId));
}

export async function saveAmenity(amenity: Omit<Amenity, 'id' | 'icon'> & { id?: string, icon: string }) {
    if (amenity.id) {
        const amenityDocRef = doc(db, 'amenities', amenity.id);
        const { id, ...amenityData } = amenity;
        await setDoc(amenityDocRef, amenityData);
    } else {
        await addDoc(collection(db, 'amenities'), amenity);
    }
}

export async function deleteAmenity(amenityId: string) {
    await deleteDoc(doc(db, 'amenities', amenityId));
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']) {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingDocRef, { status });
}
