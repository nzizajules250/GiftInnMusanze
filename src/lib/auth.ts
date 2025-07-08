import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from './types';
import { redirect } from 'next/navigation';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
  throw new Error('JWT_SECRET_KEY is not set in the environment variables.');
}
const key = new TextEncoder().encode(secret);

export async function encrypt(payload: Omit<SessionPayload, 'iat' | 'exp'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    // This is expected for invalid/expired tokens
    return null;
  }
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

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionData = { userId, role, email };
  
  const session = await encrypt(sessionData);

  cookies().set('session', session, { expires, httpOnly: true, path: '/' });
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  
  const session = await decrypt(sessionCookie);

  if (!session) return null;
  
  // Refresh cookie expiration
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  cookies().set('session', sessionCookie, { expires, httpOnly: true, path: '/' });

  return session;
}

export async function deleteSession() {
  cookies().set('session', '', { expires: new Date(0), path: '/' });
  redirect('/login');
}
