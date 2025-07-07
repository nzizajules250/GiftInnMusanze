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
  createBooking,
  saveRoom,
  deleteRoom,
  saveAmenity,
  deleteAmenity,
  updateBookingStatus,
  saveContactMessage,
  markMessageAsRead,
  findAdmins,
  createNotification,
  markNotificationsAsRead
} from './firebase-service';
import { createSession, deleteSession } from './auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Amenity, Booking } from './types';


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
  await deleteSession();
}


const createBookingSchema = z.object({
    guestName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    guestIdNumber: z.string().min(4, { message: "ID number seems too short." }),
    phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    roomName: z.string(),
    total: z.number(),
}).refine(data => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
});


export async function createBookingAction(values: z.infer<typeof createBookingSchema>) {
    let success = false;
    let bookingId;
    try {
        const validatedData = createBookingSchema.safeParse(values);
        if (!validatedData.success) {
            return { success: false, error: validatedData.error.errors[0].message };
        }
        
        const bookingData = {
            ...validatedData.data,
            status: 'Pending' as const,
        }

        bookingId = await createBooking(bookingData);

        // Notify all admins about the new booking
        const admins = await findAdmins();
        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                message: `New booking for ${bookingData.roomName} by ${bookingData.guestName}.`,
                href: `/dashboard/admin?tab=bookings`,
                isRead: false,
            });
        }
        
        success = true;
    } catch(e: any) {
        console.error('Booking creation error:', e);
        return { success: false, error: e.message || 'An unexpected error occurred.' };
    }

    if (success) {
        redirect('/login?booking=success');
    }
}

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function contactFormAction(values: z.infer<typeof contactFormSchema>) {
    try {
        const validatedData = contactFormSchema.safeParse(values);
        if (!validatedData.success) {
            return { success: false, error: validatedData.error.errors[0].message };
        }

        await saveContactMessage(validatedData.data);
        
        // Notify all admins
        const admins = await findAdmins();
        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                message: `New message from ${validatedData.data.name}.`,
                href: `/dashboard/admin?tab=messages`,
                isRead: false,
            });
        }
        
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error('Contact form error:', e);
        return { success: false, error: e.message || 'An unexpected error occurred.' };
    }
}

// Admin management actions
const imageSchema = z.object({
  url: z.string().url("Please enter a valid image URL."),
  hint: z.string().min(2, "Hint must be at least 2 characters."),
});

const roomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  images: z.array(imageSchema).min(1, "At least one image is required."),
});

export async function saveRoomAction(roomData: z.infer<typeof roomSchema>) {
    try {
        const validatedData = roomSchema.safeParse(roomData);
        if (!validatedData.success) {
            return { success: false, error: validatedData.error.errors[0].message };
        }
        await saveRoom(validatedData.data);
        revalidatePath('/dashboard/admin');
        revalidatePath('/rooms');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        console.error('Save room error:', e);
        return { success: false, error: e.message };
    }
}

export async function deleteRoomAction(roomId: string) {
    try {
        await deleteRoom(roomId);
        revalidatePath('/dashboard/admin');
        revalidatePath('/rooms');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        console.error('Delete room error:', e);
        return { success: false, error: e.message };
    }
}

export async function saveAmenityAction(amenityData: Omit<Amenity, 'id' | 'icon'> & { id?: string, icon: string }) {
     try {
        await saveAmenity(amenityData);
        revalidatePath('/dashboard/admin');
        revalidatePath('/amenities');
        return { success: true };
    } catch (e: any) {
        console.error('Save amenity error:', e);
        return { success: false, error: e.message };
    }
}

export async function deleteAmenityAction(amenityId: string) {
    try {
        await deleteAmenity(amenityId);
        revalidatePath('/dashboard/admin');
        revalidatePath('/amenities');
        return { success: true };
    } catch (e: any) {
        console.error('Delete amenity error:', e);
        return { success: false, error: e.message };
    }
}


export async function updateBookingStatusAction(bookingId: string, status: Booking['status']) {
    try {
        await updateBookingStatus(bookingId, status);
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error('Update booking status error:', e);
        return { success: false, error: e.message };
    }
}


export async function markMessageAsReadAction(messageId: string) {
    try {
        await markMessageAsRead(messageId);
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error('Mark message as read error:', e);
        return { success: false, error: e.message };
    }
}

export async function markNotificationsAsReadAction(userId: string) {
    try {
        await markNotificationsAsRead(userId);
        revalidatePath('/dashboard'); // revalidate header
        return { success: true };
    } catch (e: any) {
        console.error('Mark notifications as read error:', e);
        return { success: false, error: e.message };
    }
}

const userSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

export async function updateUserSettingsAction(values: z.infer<typeof userSettingsSchema>) {
    console.log("Updating user settings (simulated):", values);
    // In a real app, you would save these settings to the user's profile in Firebase.
    // For now, we'll just simulate a successful save.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    revalidatePath('/dashboard/settings');
    return { success: true };
}
