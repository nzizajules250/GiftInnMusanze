import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    addDoc, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    setDoc, 
    Timestamp, 
    writeBatch, 
    orderBy, 
    limit,
    type DocumentSnapshot,
    type QueryDocumentSnapshot
} from 'firebase/firestore';
import type { Room, Booking, Amenity, Attraction, Admin, SessionPayload, ContactMessage, Notification, UserProfile } from './types';

export const parseDocWithDateConversion = <T>(doc: DocumentSnapshot | QueryDocumentSnapshot): T => {
    const data = doc.data() as object;
    const processedData: { [key: string]: any } = { ...data };
    for (const key in processedData) {
        if (processedData[key] instanceof Timestamp) {
            processedData[key] = (processedData[key] as Timestamp).toDate();
        }
    }
    return { id: doc.id, ...processedData } as T;
};

const transformRoomData = (doc: DocumentSnapshot | QueryDocumentSnapshot): Room => {
    const data = parseDocWithDateConversion<any>(doc);
    if (data.image && !data.images) {
        data.images = [{ url: data.image, hint: data.hint || '' }];
        delete data.image;
        delete data.hint;
    }
    if (!data.images) {
        data.images = [];
    }
    return data as Room;
}

export async function getRooms(): Promise<Room[]> {
  const roomsCollection = collection(db, 'rooms');
  const roomsSnapshot = await getDocs(roomsCollection);
  const roomsList = roomsSnapshot.docs.map(transformRoomData);
  return roomsList;
}

export async function getRoomById(id: string): Promise<Room | null> {
    const roomDocRef = doc(db, 'rooms', id);
    const roomSnapshot = await getDoc(roomDocRef);
    if (!roomSnapshot.exists()) {
        return null;
    }
    return transformRoomData(roomSnapshot);
}

export async function getBookingById(id: string): Promise<Booking | null> {
    const bookingDocRef = doc(db, 'bookings', id);
    const bookingSnapshot = await getDoc(bookingDocRef);
    if (!bookingSnapshot.exists()) {
        return null;
    }
    return parseDocWithDateConversion<Booking>(bookingSnapshot);
}

export async function getAmenities(): Promise<Amenity[]> {
    const amenitiesCollection = collection(db, 'amenities');
    const amenitiesSnapshot = await getDocs(amenitiesCollection);
    return amenitiesSnapshot.docs.map(doc => parseDocWithDateConversion<Amenity>(doc));
}

export async function getAttractions(): Promise<Attraction[]> {
    const attractionsCollection = collection(db, 'attractions');
    const attractionsSnapshot = await getDocs(attractionsCollection);
    return attractionsSnapshot.docs.map(doc => parseDocWithDateConversion<Attraction>(doc));
}

export async function getBookings(): Promise<Booking[]> {
    const bookingsCollection = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsCollection);
    return bookingsSnapshot.docs.map(doc => parseDocWithDateConversion<Booking>(doc));
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
        return [parseDocWithDateConversion<Booking>(bookingSnapshot)];
    }
    
    // Fallback if guest's booking is not found
    return [];
}


export async function getUserProfile(session: SessionPayload): Promise<UserProfile | null> {
    if (session.role === 'admin') {
        const adminDocRef = doc(db, 'admins', session.userId);
        const adminSnapshot = await getDoc(adminDocRef);
        if (adminSnapshot.exists()) {
            const adminData = adminSnapshot.data() as Admin;
            return {
                name: adminData.name || "Administrator",
                email: adminData.email,
                avatar: adminData.avatar || "https://placehold.co/100x100.png"
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
                email: "Guest Account (no email)",
                avatar: bookingData.avatar || "https://placehold.co/100x100.png"
            }
        }
    }

    // Fallback for not found user
    return null;
}


// --- Auth & Booking Functions ---

export async function findBookingForLogin(guestName: string, guestIdNumber: string, phoneNumber: string): Promise<Booking | null> {
    const q = query(collection(db, 'bookings'), 
        where('guestName', '==', guestName),
        where('guestIdNumber', '==', guestIdNumber),
        where('phoneNumber', '==', phoneNumber),
        where('status', 'in', ['Confirmed', 'Pending'])
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    // Assuming the combination is unique, return the first match
    return parseDocWithDateConversion<Booking>(snapshot.docs[0]);
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
    const q = query(collection(db, 'admins'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    return parseDocWithDateConversion<Admin>(snapshot.docs[0]);
}

export async function findAdmins(): Promise<Admin[]> {
    const adminsCollection = collection(db, 'admins');
    const adminsSnapshot = await getDocs(adminsCollection);
    return adminsSnapshot.docs.map(doc => parseDocWithDateConversion<Admin>(doc));
}

export async function createAdminUserInFirestore(email: string, passwordHash: string): Promise<string> {
    const adminsCollection = collection(db, 'admins');
    const docRef = await addDoc(adminsCollection, { 
        email, 
        passwordHash, 
        name: 'Administrator' 
    });
    return docRef.id;
}

export async function updateUserProfile(session: SessionPayload, data: { name?: string; passwordHash?: string; avatar?: string; }) {
    if (session.role === 'admin') {
        if (!data.name && !data.passwordHash && data.avatar === undefined) return;
        const adminDocRef = doc(db, 'admins', session.userId);
        const updateData: { name?: string, passwordHash?: string, avatar?: string } = {};
        if (data.name) updateData.name = data.name;
        if (data.passwordHash) updateData.passwordHash = data.passwordHash;
        if (data.avatar !== undefined) updateData.avatar = data.avatar;
        await updateDoc(adminDocRef, updateData);
    } else if (session.role === 'guest') {
        if (!data.name && data.avatar === undefined) return;
        const bookingDocRef = doc(db, 'bookings', session.userId);
        const updateData: { guestName?: string, avatar?: string } = {};
        if(data.name) updateData.guestName = data.name;
        if(data.avatar !== undefined) updateData.avatar = data.avatar;
        await updateDoc(bookingDocRef, updateData);
    }
}


type NewBookingData = Omit<Booking, 'id'>;

export async function createBooking(bookingData: NewBookingData): Promise<string> {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, bookingData);
    return docRef.id;
}

export async function findOverlappingBookings(roomId: string, checkIn: Date, checkOut: Date): Promise<Booking[]> {
    const bookingsRef = collection(db, 'bookings');
    
    // An overlap exists if a booking's start date is before the new checkout date,
    // AND its end date is after the new check-in date.
    // (startDate < newEndDate) && (endDate > newStartDate)
    
    const q = query(
        bookingsRef,
        where('roomId', '==', roomId),
        where('status', 'in', ['Confirmed', 'Pending']),
        where('checkIn', '<', checkOut),
        // Firestore doesn't allow multiple range filters on different fields,
        // so we'll have to filter the second condition in the application code.
    );

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => parseDocWithDateConversion<Booking>(doc));

    // Filter for the second part of the overlap condition
    return bookings.filter(booking => booking.checkOut > checkIn);
}


// Admin management functions

export async function saveRoom(room: Omit<Room, 'id'> & { id?: string }) {
    const roomDataToSave: Omit<Room, 'id'> = {
        name: room.name,
        description: room.description,
        price: room.price,
        images: room.images,
    };

    if (room.id) {
        const roomDocRef = doc(db, 'rooms', room.id);
        await setDoc(roomDocRef, roomDataToSave);
    } else {
        await addDoc(collection(db, 'rooms'), roomDataToSave);
    }
}

export async function deleteRoom(roomId: string) {
    await deleteDoc(doc(db, 'rooms', roomId));
}

export async function saveAmenity(amenity: Omit<Amenity, 'id'> & { id?: string }) {
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


// --- Contact Messages ---
type NewContactMessage = Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>;

export async function saveContactMessage(message: NewContactMessage): Promise<string> {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
        ...message,
        createdAt: Timestamp.now(),
        isRead: false
    });
    return docRef.id;
}

export async function getMessagesForAdmin(): Promise<ContactMessage[]> {
    const messagesCollection = collection(db, 'contactMessages');
    const messagesSnapshot = await getDocs(messagesCollection);
    return messagesSnapshot.docs.map(doc => parseDocWithDateConversion<ContactMessage>(doc));
}

export async function markMessageAsRead(messageId: string): Promise<void> {
    const messageDocRef = doc(db, 'contactMessages', messageId);
    await updateDoc(messageDocRef, { isRead: true });
}

// --- Notifications ---
type NewNotification = Omit<Notification, 'id' | 'createdAt'>;

export async function createNotification(notification: NewNotification): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getAdminNotifications(): Promise<Notification[]> {
    const admins = await findAdmins();
    if (admins.length === 0) {
        return [];
    }
    const adminIds = admins.map(a => a.id);

    // Firestore 'in' query is limited to 30 items. We'll query for the first 30 admins.
    const q = query(
        collection(db, 'notifications'), 
        where('userId', 'in', adminIds.slice(0, 30)),
        orderBy('createdAt', 'desc'),
        limit(10)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => parseDocWithDateConversion<Notification>(doc));
}

export async function markNotificationsAsRead(userId: string): Promise<void> {
    const q = query(collection(db, 'notifications'), 
        where('userId', '==', userId), 
        where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
}
