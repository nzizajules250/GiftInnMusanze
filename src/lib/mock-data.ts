import { Utensils, Wifi, Dumbbell, Waves, Sparkles, Wind, MapPin, Building, Trees, ShoppingBag } from "lucide-react";

export type Room = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  hint: string;
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Queen Room",
    description: "A beautifully appointed room with a queen-sized bed, perfect for solo travelers or couples.",
    price: 150,
    image: "https://placehold.co/600x400.png",
    hint: "deluxe room"
  },
  {
    id: 2,
    name: "Executive King Suite",
    description: "Spacious and luxurious, this suite features a king-sized bed and a separate living area.",
    price: 250,
    image: "https://placehold.co/600x400.png",
    hint: "king suite"
  },
  {
    id: 3,
    name: "Family Garden View Room",
    description: "Ideal for families, with two double beds and a stunning view of our private gardens.",
    price: 220,
    image: "https://placehold.co/600x400.png",
    hint: "family room"
  },
  {
    id: 4,
    name: "Presidential Suite",
    description: "The pinnacle of luxury, offering panoramic city views, a private jacuzzi, and butler service.",
    price: 800,
    image: "https://placehold.co/600x400.png",
    hint: "presidential suite"
  },
   {
    id: 5,
    name: "Standard Double Room",
    description: "A comfortable and stylish room with two single beds, equipped with all modern amenities.",
    price: 180,
    image: "https://placehold.co/600x400.png",
    hint: "double room"
  },
  {
    id: 6,
    name: "Honeymoon Suite",
    description: "A romantic escape with a four-poster bed, private balcony, and complimentary champagne.",
    price: 350,
    image: "https://placehold.co/600x400.png",
    hint: "honeymoon suite"
  },
];

export const amenities = [
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Relax and rejuvenate in our temperature-controlled indoor and outdoor pools.",
    details: "Open 7 AM - 10 PM",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "Stay active with our state-of-the-art gym equipment and yoga studio.",
    details: "Open 24/7",
  },
  {
    icon: Sparkles,
    title: "Serenity Spa",
    description: "Indulge in a range of treatments designed to soothe your body and mind.",
    details: "Open 9 AM - 8 PM",
  },
  {
    icon: Utensils,
    title: "Gourmet Dining",
    description: "Savor exquisite dishes at our fine dining restaurant, The Gilded Spoon.",
    details: "Breakfast, Lunch, Dinner",
  },
];

export const attractions = [
  {
    icon: Building,
    name: "Metropolitan Museum of Art",
    distance: "2.5 miles",
    description: "One of the world's largest and finest art museums."
  },
  {
    icon: Trees,
    name: "Central Park",
    distance: "1.8 miles",
    description: "An urban oasis with vast green spaces, lakes, and walking trails."
  },
  {
    icon: ShoppingBag,
    name: "Fifth Avenue Shopping",
    distance: "3.0 miles",
    description: "Iconic luxury boutiques and flagship stores."
  },
  {
    icon: MapPin,
    name: "Times Square",
    distance: "4.0 miles",
    description: "The vibrant, neon-lit heart of the city."
  }
];
