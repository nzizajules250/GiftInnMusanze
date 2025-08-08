
'use server';

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
  markNotificationsAsRead,
  getBookingById,
  updateUserProfile,
  findOverlappingBookings,
  getUserBookings,
} from './firebase-service';
import { createSession, getSession, logoutAction } from './auth';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Amenity, Booking } from './types';
import { generateRoomDescription } from '@/ai/flows/room-description-flow';
import { confirmBookingWithAI } from '@/ai/flows/booking-confirmation-flow';

const guestLoginSchema = z.object({
  guestName: z.string().min(1, 'Guest name is required.'),
  guestIdNumber: z.string().min(1, 'ID number is required.'),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
});

export async function guestLoginAction(values: z.infer<typeof guestLoginSchema>): Promise<{ error?: string }> {
  try {
    const validatedData = guestLoginSchema.safeParse(values);
    if (!validatedData.success) {
      return { error: 'Invalid input.' };
    }

    const { guestName, guestIdNumber, phoneNumber } = validatedData.data;
    const booking = await findBookingForLogin(
      guestName,
      guestIdNumber,
      phoneNumber
    );

    if (!booking) {
      return {
        error: 'No confirmed or pending booking found with these details. Please check your information or contact support.',
      };
    }

    await createSession(booking.id, 'guest', `guest-${booking.id}@giftinn.local`);
    redirect('/dashboard');
  } catch (e: any) {
    if (e.digest?.includes('NEXT_REDIRECT')) {
        throw e;
    }
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function adminLoginAction(values: z.infer<typeof adminLoginSchema>): Promise<{ error?: string }> {
    try {
        const validatedData = adminLoginSchema.safeParse(values);
        if (!validatedData.success) {
        return { error: 'Invalid input.' };
        }

        const { email, password } = validatedData.data;
        const admin = await findAdminByEmail(email);

        if (!admin) {
        return { error: 'Invalid credentials.' };
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!isPasswordMatch) {
        return { error: 'Invalid credentials.' };
        }

        await createSession(admin.id, 'admin', admin.email);
        redirect('/dashboard/admin');
    } catch (e: any) {
        if (e.digest?.includes('NEXT_REDIRECT')) {
            throw e;
        }
        console.error(e);
        return { error: e.message || 'An unexpected error occurred.' };
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
): Promise<{ error?: string }> {
    try {
        const validatedData = adminRegisterSchema.safeParse(values);
        if (!validatedData.success) {
            const firstError = validatedData.error.errors[0].message;
            return { error: firstError };
        }

        const { email, password } = validatedData.data;

        const existingAdmin = await findAdminByEmail(email);
        if (existingAdmin) {
            return {
                error: 'An admin with this email already exists.',
            };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const adminId = await createAdminUserInFirestore(email, passwordHash);

        await createSession(adminId, 'admin', email);
        redirect('/dashboard/admin');
    } catch (e: any) {
        if (e.digest?.includes('NEXT_REDIRECT')) {
            throw e;
        }
        console.error(e);
        return {
            error:
                e.message || 'An unexpected error occurred during registration.',
        };
    }
}

export { logoutAction };


const createBookingSchema = z.object({
    roomId: z.string(),
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


export async function createBookingAction(values: z.infer<typeof createBookingSchema>): Promise<{ error?: string } | void> {
    try {
        const validatedData = createBookingSchema.safeParse(values);
        if (!validatedData.success) {
            return { error: validatedData.error.errors[0].message };
        }
        
        const bookingData = {
            ...validatedData.data,
            status: 'Pending' as const,
        }

        const overlappingBookings = await findOverlappingBookings(bookingData.roomId, bookingData.checkIn, bookingData.checkOut);
        if (overlappingBookings.length > 0) {
            return { error: "This room is already booked for the selected dates. Please choose different dates." };
        }


        const bookingId = await createBooking(bookingData);

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
        redirect('/login?booking=success');
    } catch(e: any) {
        if (e.digest?.includes('NEXT_REDIRECT')) {
            throw e;
        }
        console.error(e);
        return { error: e.message || 'An unexpected error occurred.' };
    }
}

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function contactFormAction(values: z.infer<typeof contactFormSchema>): Promise<{ success: boolean; error?: string; }> {
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
        console.error(e);
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

export async function saveRoomAction(roomData: z.infer<typeof roomSchema>): Promise<{ success: boolean; error?: string; }> {
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
        console.error(e);
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
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function saveAmenityAction(amenityData: Omit<Amenity, 'id' | 'icon'> & { id?: string, icon: string }): Promise<{ success: boolean; error?: string; }> {
     try {
        await saveAmenity(amenityData);
        revalidatePath('/dashboard/admin');
        revalidatePath('/amenities');
        return { success: true };
    } catch (e: any) {
        console.error(e);
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
        console.error(e);
        return { success: false, error: e.message };
    }
}


export async function updateBookingStatusAction(bookingId: string, status: Booking['status']) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            throw new Error('Unauthorized action.');
        }

        const adminId = session.userId;
        
        await updateBookingStatus(bookingId, status);

        const booking = await getBookingById(bookingId);
        if (!booking) {
            throw new Error('Booking not found.');
        }

        // Create notification for the guest
        await createNotification({
            userId: booking.id, // For guests, their session userId is their bookingId
            message: `Your booking for ${booking.roomName} has been ${status.toLowerCase()}.`,
            href: '/dashboard',
            isRead: false,
        });

        // Create a confirmation notification for the admin who made the change
        await createNotification({
            userId: adminId,
            message: `You ${status.toLowerCase()} the booking for ${booking.guestName}.`,
            href: `/dashboard/admin?tab=bookings`,
            isRead: false,
        });

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}


export async function markMessageAsReadAction(messageId: string) {
    try {
        await markMessageAsRead(messageId);
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function markNotificationsAsReadAction(userId: string) {
    try {
        await markNotificationsAsRead(userId);
        revalidatePath('/dashboard'); // revalidate header
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatar: z.string().url("Please enter a valid image URL.").or(z.literal("")).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
})
.refine(data => !data.newPassword || data.newPassword.length >= 8, {
    message: "New password must be at least 8 characters.",
    path: ["newPassword"],
})
.refine(data => !data.newPassword || !!data.currentPassword, {
    message: "Current password is required to set a new one.",
    path: ["currentPassword"],
});


export async function updateUserProfileAction(values: z.infer<typeof profileFormSchema>): Promise<{ success: boolean; error?: string; }> {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: 'Unauthorized.' };
        
        const validatedData = profileFormSchema.safeParse(values);
        if (!validatedData.success) {
            return { success: false, error: validatedData.error.errors[0].message };
        }

        const { name, avatar, currentPassword, newPassword } = validatedData.data;
        const updatePayload: { name?: string; passwordHash?: string; avatar?: string; } = { name };
        
        if (avatar !== undefined) {
            updatePayload.avatar = avatar;
        }

        if (session.role === 'admin' && newPassword && currentPassword) {
            const admin = await findAdminByEmail(session.email);

            if(!admin) return { success: false, error: "Admin not found." };
            
            const isPasswordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
            if (!isPasswordMatch) {
                return { success: false, error: "Incorrect current password." };
            }
            updatePayload.passwordHash = await bcrypt.hash(newPassword, 10);
        }

        await updateUserProfile(session, updatePayload);

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard');
        return { success: true };

    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function cancelUserBookingAction(bookingId: string) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'guest' || session.userId !== bookingId) {
            return { success: false, error: 'Unauthorized action.' };
        }

        await updateBookingStatus(bookingId, 'Cancelled');

        const booking = await getBookingById(bookingId);
        if (!booking) {
            return { success: false, error: 'Booking not found.' };
        }

        const admins = await findAdmins();
        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                message: `Guest ${booking.guestName} cancelled their booking for ${booking.roomName}.`,
                href: `/dashboard/admin?tab=bookings`,
                isRead: false,
            });
        }
        
        revalidatePath('/dashboard');
        return { success: true };

    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}


const userSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

export async function updateUserSettingsAction(values: z.infer<typeof userSettingsSchema>): Promise<{ success: boolean; error?: string; }> {
    try {
        console.log("Updating user settings (simulated):", values);
        // In a real app, you would save these settings to the user's profile in Firebase.
        // For now, we'll simulate a successful save.
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch(e: any) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

export async function generateRoomDescriptionAction(roomName: string): Promise<{
    success: boolean;
    description?: string;
    error?: string;
}> {
    try {
        const description = await generateRoomDescription({ roomName });
        return { success: true, description: description.description };
    } catch(e: any) {
        console.error(e);
        return { success: false, error: "Failed to generate description. Please try again." };
    }
}

export async function confirmBookingWithAIAction(query: string): Promise<{
    success: boolean;
    response?: string;
    error?: string;
}> {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: "Authentication required." };
        }
        const userBookings = await getUserBookings(session);

        const result = await confirmBookingWithAI({
            query,
            bookings: userBookings,
        });

        return { success: true, response: result.response };

    } catch(e: any) {
        console.error(e);
        return { success: false, error: "The AI assistant is currently unavailable. Please try again later." };
    }
}
