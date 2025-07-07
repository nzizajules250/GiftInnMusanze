import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/firebase-service";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline">Our Accommodations</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Each of our rooms and suites is designed with your comfort and luxury in mind. Discover the perfect space for your stay.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
