import Image from "next/image";
import type { Room } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  room: Room;
  isOccupied?: boolean;
}

export function RoomCard({ room, isOccupied = false }: RoomCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl duration-300 group">
      <div className="relative w-full h-60 overflow-hidden">
        <Image
          src={room.images?.[0]?.url || 'https://placehold.co/600x400.png'}
          alt={`View of ${room.name}`}
          fill
          className={cn("object-cover transition-transform duration-500 group-hover:scale-110", isOccupied && "brightness-50")}
        />
         {isOccupied && (
            <Badge variant="destructive" className="absolute top-3 right-3">Occupied</Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{room.name}</CardTitle>
        <p className="text-lg font-bold text-primary/80 pt-1">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{room.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild variant="default" className="w-full" disabled={isOccupied}>
          <Link href={`/rooms/${room.id}`} className={cn(isOccupied && "pointer-events-none")}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
