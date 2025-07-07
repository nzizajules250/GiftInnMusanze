import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BookingForm } from "@/components/BookingForm";
import { getRooms, getAmenities, getBookings } from "@/lib/firebase-service";
import { RoomCard } from "@/components/RoomCard";
import { AmenityCard } from "@/components/AmenityCard";
import { AnimatedTitle } from "@/components/AnimatedTitle";

const heroImages = [
  { src: "https://placehold.co/1600x800.png", alt: "Modern hotel lobby with elegant seating", hint: "hotel lobby" },
  { src: "https://placehold.co/1600x800.png", alt: "Luxurious hotel suite with a city view", hint: "hotel suite" },
  { src: "https://placehold.co/1600x800.png", alt: "Rooftop pool with a stunning sunset view", hint: "rooftop pool" },
];

export default async function Home() {
  const [rooms, amenities, bookings] = await Promise.all([getRooms(), getAmenities(), getBookings()]);
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const occupiedRoomIds = new Set(
    confirmedBookings
      .filter(booking => {
          if (!booking.roomId) return false;
          const checkIn = new Date(booking.checkIn);
          const checkOut = new Date(booking.checkOut);
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);
          return checkIn <= today && checkOut > today;
      })
      .map(booking => booking.roomId)
  );


  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-[60vh] md:h-[80vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    data-ai-hint={image.hint}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
          <AnimatedTitle 
            text="Welcome to Gift Inn" 
            className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg"
          />
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
            Your exclusive sanctuary for peace and luxury.
          </p>
        </div>
      </section>

      <div className="transform -translate-y-16 z-20 w-full px-4">
          <BookingForm />
      </div>

      <section className="container mx-auto px-4 py-16 -mt-16">
        <h2 className="text-4xl font-headline text-center mb-12">
          Our Accommodations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.slice(0, 9).map((room) => (
            <RoomCard key={room.id} room={room} isOccupied={occupiedRoomIds.has(room.id)} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-headline text-center mb-12">
          World-Class Amenities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>
      </section>
    </div>
  );
}
