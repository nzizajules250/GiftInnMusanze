import { BookingForm } from "@/components/BookingForm";
import { getRooms, getAmenities, getBookings } from "@/lib/firebase-service";
import { RoomCard } from "@/components/RoomCard";
import { AmenityCard } from "@/components/AmenityCard";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

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
      <section className="relative w-full h-[70vh] md:h-[90vh]">
        <HeroCarousel />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4 z-10 pointer-events-none">
          <AnimatedTitle 
            text="Welcome to Gift Inn" 
            className="font-headline text-5xl md:text-7xl lg:text-8xl drop-shadow-lg"
          />
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-md">
            Your exclusive sanctuary for peace and luxury.
          </p>
        </div>
      </section>

      <div className="transform -translate-y-20 z-20 w-full px-4">
          <BookingForm />
      </div>

      <section className="container mx-auto px-4 py-16 -mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
            Our Accommodations
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">Discover our collection of rooms, each designed to provide an unparalleled experience of comfort and elegance. Find the perfect space for your stay with us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.slice(0, 3).map((room) => (
            <RoomCard key={room.id} room={room} isOccupied={occupiedRoomIds.has(room.id)} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/rooms">View All Rooms</Link>
            </Button>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image src="https://i.ibb.co/6y6fXG8/reception-desk.jpg" alt="Hotel reception" layout="fill" objectFit="cover" data-ai-hint="hotel reception" />
                </div>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
                        Unforgettable Experiences Await
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        At Gift Inn, we are dedicated to providing an experience that transcends the ordinary. From our meticulously designed interiors to our personalized services, every detail is crafted to ensure your stay is nothing short of perfect. Let us be your home away from home.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline text-primary mb-4">
            World-Class Amenities
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">Enjoy a wide range of amenities designed to make your stay comfortable, relaxing, and memorable. We cater to all your needs with premium facilities.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.slice(0, 4).map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>
      </section>
    </div>
  );
}
