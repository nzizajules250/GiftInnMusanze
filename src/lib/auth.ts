import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from './types';
import { redirect } from 'next/navigation';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const secretKey = process.env.JWT_SECRET_KEY;

// Throw an error during build or at server start if the key is missing.
if (!secretKey) {
  throw new Error('JWT_SECRET_KEY is not set in environment variables. Please add it to your .env file.');
}

const encodedKey = new TextEncoder().encode(secretKey);
const aDay = 24 * 60 * 60 * 1000;

export async function createSession(userId: string, role: 'admin' | 'guest') {
  const expires = new Date(Date.now() + aDay);
  
  let email = '';
  if (role === 'admin') {
      const adminDocRef = doc(db, 'admins', userId);
      const adminSnapshot = await getDoc(adminDocRef);
      if (adminSnapshot.exists()) {
          email = adminSnapshot.data().email;
      }
  }
  
  const session: SessionPayload = { userId, role, expires, email };

  const jwt = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey);
  
  cookies().set('session', jwt, {
    expires,
    httpOnly: true,
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    // This will effectively log out the user with an invalid token.
    console.error('Failed to verify session:', error);
    return null;
  }
}

export function deleteSession() {
  cookies().delete('session');
  redirect('/login');
}
