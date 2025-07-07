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
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative w-full h-60">
        <Image
          src={room.images?.[0]?.url || 'https://placehold.co/600x400.png'}
          alt={`View of ${room.name}`}
          data-ai-hint={room.images?.[0]?.hint}
          fill
          className={cn("object-cover", isOccupied && "brightness-50")}
        />
         {isOccupied && (
            <Badge variant="destructive" className="absolute top-3 right-3">Occupied</Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
        <CardDescription className="pt-2">{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
        <Button asChild variant="outline" disabled={isOccupied}>
          <Link href={`/rooms/${room.id}`} className={cn(isOccupied && "pointer-events-none")}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
