import 'server-only';
import { cookies } from 'next/headers';
import type { SessionPayload } from './types';
import { redirect } from 'next/navigation';
import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { randomBytes } from 'crypto';

const aDayInSeconds = 24 * 60 * 60;

// This function will create a new session document in Firestore
async function createSessionInFirestore(userId: string, role: 'admin' | 'guest', email: string) {
    const sessionId = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + aDayInSeconds * 1000);
    
    const sessionDocRef = doc(db, 'sessions', sessionId);
    await setDoc(sessionDocRef, {
        userId,
        role,
        email,
        expires: Timestamp.fromDate(expires),
    });

    return { sessionId, expires };
}

export async function createSession(userId: string, role: 'admin' | 'guest') {
  let email = '';
  if (role === 'admin') {
      const adminDocRef = doc(db, 'admins', userId);
      const adminSnapshot = await getDoc(adminDocRef);
      if (adminSnapshot.exists()) {
          email = adminSnapshot.data().email;
      }
  }

  const { sessionId, expires } = await createSessionInFirestore(userId, role, email);
  
  cookies().set('session', sessionId, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionId = cookies().get('session')?.value;
  if (!sessionId) {
    return null;
  }

  const sessionDocRef = doc(db, 'sessions', sessionId);
  const sessionSnapshot = await getDoc(sessionDocRef);

  if (!sessionSnapshot.exists()) {
    // Session doesn't exist in DB, treat as logged out.
    // The invalid cookie will be overwritten on next login.
    return null;
  }

  const sessionData = sessionSnapshot.data();
  const expires = (sessionData.expires as Timestamp).toDate();

  if (expires < new Date()) {
    // Session has expired, delete it from Firestore but don't touch cookies here.
    await deleteDoc(sessionDocRef);
    return null;
  }

  return {
    userId: sessionData.userId,
    role: sessionData.role,
    email: sessionData.email,
    expires: expires,
  };
}

export async function deleteSession() {
  const sessionId = cookies().get('session')?.value;
  if (sessionId) {
      try {
        const sessionDocRef = doc(db, 'sessions', sessionId);
        await deleteDoc(sessionDocRef);
      } catch (error) {
          console.error("Failed to delete session from Firestore:", error);
      }
  }
  cookies().delete('session');
  redirect('/login');
}
