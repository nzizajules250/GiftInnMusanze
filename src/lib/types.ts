import type { LucideIcon } from 'lucide-react';

export type RoomImage = {
  url: string;
  hint: string;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: RoomImage[];
};

export type Amenity = {
    id: string;
    icon: string;
    title: string;
    description: string;
    details: string;
};

export type Attraction = {
    id: string;
    icon: string;
    name: string;
    distance: string;
    description: string;
}

export type Booking = {
  id: string;
  roomId: string;
  guestName: string;
  guestIdNumber: string;
  phoneNumber: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  total: number;
  avatar?: string;
};

export type Admin = {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    avatar?: string;
}

export type SessionPayload = {
    userId: string;
    role: 'admin' | 'guest';
    email: string;
    iat?: number;
    exp?: number;
};

export type UserProfile = {
    name: string;
    email: string;
    avatar: string | null;
}

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

export type Notification = {
    id: string;
    userId: string; // The user who should receive the notification
    message: string;
    href: string; // Link to the relevant page (e.g., a booking)
    createdAt: Date;
    isRead: boolean;
}
