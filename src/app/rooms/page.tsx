import { RoomCard } from "@/components/RoomCard";
import { getRooms, getBookings } from "@/lib/firebase-service";

export const dynamic = 'force-dynamic';

export default async function RoomsPage() {
  const [rooms, bookings] = await Promise.all([getRooms(), getBookings()]);
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-headline text-primary">Our Accommodations</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Each of our rooms and suites is designed with your comfort and luxury in mind. Discover the perfect space for your stay.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} isOccupied={occupiedRoomIds.has(room.id)} />
        ))}
      </div>
    </div>
  );
}
