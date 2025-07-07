import Image from "next/image";
import type { Room } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative w-full h-60">
        <Image
          src={room.image}
          alt={`View of ${room.name}`}
          data-ai-hint={room.hint}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{room.name}</CardTitle>
        <CardDescription className="pt-2">{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
        <Button asChild variant="outline">
          <Link href={`/rooms/${room.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
