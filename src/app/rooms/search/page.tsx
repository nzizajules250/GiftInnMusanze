import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/firebase-service";
import type { Room } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams?.q as string | undefined;
  
  if (!query?.trim()) {
      return (
         <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-headline">Search Rooms</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Please enter a search term in the header to find a room.
            </p>
            <Button asChild className="mt-6">
                <Link href="/rooms">Browse All Rooms</Link>
            </Button>
        </div>
      )
  }

  const allRooms = await getRooms();
  
  const trimmedQuery = query.trim().toLowerCase();
  const filteredRooms = allRooms.filter(
    (room) =>
        room.name.toLowerCase().includes(trimmedQuery) ||
        room.description.toLowerCase().includes(trimmedQuery)
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline">Search Results</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'result' : 'results'} for: <span className="font-semibold text-foreground">{query}</span>
        </p>
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
            We couldn't find any rooms matching your search. Try a different term.
          </p>
           <Button asChild className="mt-6">
                <Link href="/rooms">Browse All Rooms</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
