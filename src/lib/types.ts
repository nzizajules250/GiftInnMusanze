import type { LucideIcon } from 'lucide-react';

export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hint: string;
};

export type Amenity = {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    details: string;
};

export type Attraction = {
    id: string;
    icon: LucideIcon;
    name: string;
    distance: string;
    description: string;
}

export type Booking = {
  id: string;
  guestName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  total: number;
};
