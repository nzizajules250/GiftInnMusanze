import { RoomCard } from "@/components/RoomCard";
import { getRooms, getBookings } from "@/lib/firebase-service";
import type { Room } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/BookingForm";

export const dynamic = 'force-dynamic';

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { [key:string]: string | string[] | undefined };
}) {
  const query = searchParams?.q as string | undefined;
  const checkIn = searchParams?.checkIn as string | undefined;
  const checkOut = searchParams?.checkOut as string | undefined;
  const guests = searchParams?.guests as string | undefined;

  const [allRooms, allBookings] = await Promise.all([getRooms(), getBookings()]);
  const confirmedBookings = allBookings.filter(b => b.status === 'Confirmed');
  
  let filteredRooms: Room[] = [];
  let title = "Search For a Room";
  let description = "";

  if (query?.trim()) {
    const trimmedQuery = query.trim().toLowerCase();
    filteredRooms = allRooms.filter(
      (room) =>
        room.name.toLowerCase().includes(trimmedQuery) ||
        room.description.toLowerCase().includes(trimmedQuery)
    );
    title = "Search Results";
    description = `${filteredRooms.length} ${
      filteredRooms.length === 1 ? "result" : "results"
    } for: "${query}"`;
  } else if (checkIn && checkOut) {
    const searchCheckIn = new Date(checkIn);
    const searchCheckOut = new Date(checkOut);
    
    const occupiedRoomIds = new Set(
        confirmedBookings.filter(booking => {
            if (!booking.roomId) return false;
            const bookingCheckIn = new Date(booking.checkIn);
            const bookingCheckOut = new Date(booking.checkOut);
            // Check for date range overlap
            return bookingCheckIn < searchCheckOut && bookingCheckOut > searchCheckIn;
        }).map(booking => booking.roomId)
    );
    
    filteredRooms = allRooms.filter(room => !occupiedRoomIds.has(room.id));
    
    const guestCount = parseInt(guests || "1");
    title = "Available Rooms";
    description = `Found ${filteredRooms.length} rooms available from ${checkIn} to ${checkOut} for ${guestCount} ${guestCount === 1 ? "guest" : "guests"}`;
  } else {
    // If no search params, show the booking form to prompt a search.
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-headline text-primary">Find Your Perfect Room</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Use the form below to check availability and find the ideal room for
          your stay.
        </p>
        <div className="mt-8 max-w-4xl mx-auto">
            <BookingForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline text-primary">{title}</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className="mb-12 max-w-4xl mx-auto">
         <BookingForm />
      </div>

      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl font-semibold">No Rooms Found</p>
          <p className="text-muted-foreground mt-2">
            We couldn't find any rooms matching your criteria. Try different
            dates or search terms.
          </p>
          <Button asChild className="mt-6">
            <Link href="/rooms">Browse All Rooms</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
