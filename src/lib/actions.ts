'use server';

import {
  getPersonalizedRecommendations,
  PersonalizedRecommendationsInput,
} from '@/ai/flows/personalized-recommendations';
import { z } from 'zod';
import {
  findBookingForLogin,
  findAdminByEmail,
  createAdminUserInFirestore,
} from './firebase-service';
import { createSession, deleteSession } from './auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function getRecommendationsAction(
  input: PersonalizedRecommendationsInput
) {
  try {
    const result = await getPersonalizedRecommendations(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      error: e.message || 'Failed to get recommendations.',
    };
  }
}

const guestLoginSchema = z.object({
  guestName: z.string().min(1, 'Guest name is required.'),
  guestIdNumber: z.string().min(1, 'ID number is required.'),
  roomName: z.string().min(1, 'Room name is required.'),
});

export async function guestLoginAction(values: z.infer<typeof guestLoginSchema>) {
  let success = false;
  try {
    const validatedData = guestLoginSchema.safeParse(values);
    if (!validatedData.success) {
      return { success: false, error: 'Invalid input.' };
    }

    const { guestName, guestIdNumber, roomName } = validatedData.data;
    const booking = await findBookingForLogin(
      guestName,
      guestIdNumber,
      roomName
    );

    if (!booking) {
      return {
        success: false,
        error: 'Invalid credentials. Please check your details and try again.',
      };
    }

    await createSession(booking.id, 'guest');
    success = true;
  } catch (e: any) {
    console.error('Guest login error:', e);
    return { success: false, error: e.message || 'An unexpected error occurred.' };
  }

  if (success) {
    redirect('/dashboard');
  }
}

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function adminLoginAction(values: z.infer<typeof adminLoginSchema>) {
  let success = false;
  try {
    const validatedData = adminLoginSchema.safeParse(values);
    if (!validatedData.success) {
      return { success: false, error: 'Invalid input.' };
    }

    const { email, password } = validatedData.data;
    const admin = await findAdminByEmail(email);

    if (!admin) {
      return { success: false, error: 'Invalid credentials.' };
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordMatch) {
      return { success: false, error: 'Invalid credentials.' };
    }

    await createSession(admin.id, 'admin');
    success = true;
  } catch (e: any) {
    console.error('Admin login error:', e);
    return { success: false, error: e.message || 'An unexpected error occurred.' };
  }
  if (success) {
    redirect('/dashboard/admin');
  }
}

const adminRegisterSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  secretCode: z.string().refine((code) => code === 'giftInn2025', {
    message: 'Invalid secret code.',
  }),
});

export async function adminRegisterAction(
  values: z.infer<typeof adminRegisterSchema>
) {
  let success = false;
  try {
    const validatedData = adminRegisterSchema.safeParse(values);
    if (!validatedData.success) {
      const firstError = validatedData.error.errors[0].message;
      return { success: false, error: firstError };
    }

    const { email, password } = validatedData.data;

    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return {
        success: false,
        error: 'An admin with this email already exists.',
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const adminId = await createAdminUserInFirestore(email, passwordHash);

    await createSession(adminId, 'admin');
    success = true;
  } catch (e: any) {
    console.error('Admin registration error:', e);
    return {
      success: false,
      error:
        e.message || 'An unexpected error occurred during registration.',
    };
  }
  if (success) {
    redirect('/dashboard/admin');
  }
}

export async function logoutAction() {
  deleteSession();
}
