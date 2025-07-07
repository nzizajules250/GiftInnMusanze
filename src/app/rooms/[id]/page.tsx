import { getRoomById } from "@/lib/firebase-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { RoomBookingForm } from "@/components/RoomBookingForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
    const room = await getRoomById(params.id);

    if (!room) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <Carousel className="rounded-lg overflow-hidden shadow-lg">
                        <CarouselContent>
                            {room.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full h-[300px] md:h-[500px]">
                                        <Image
                                            src={image.url}
                                            alt={`View ${index + 1} of ${room.name}`}
                                            data-ai-hint={image.hint}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                            {room.images.length === 0 && (
                                <CarouselItem>
                                    <div className="relative w-full h-[300px] md:h-[500px]">
                                        <Image
                                            src="https://placehold.co/800x500.png"
                                            alt="Placeholder image"
                                            data-ai-hint="hotel interior"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        {room.images.length > 1 && (
                            <>
                                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                            </>
                        )}
                    </Carousel>

                    <div className="mt-8">
                        <h1 className="text-4xl font-headline">{room.name}</h1>
                        <p className="text-2xl font-bold mt-2">${room.price}<span className="text-lg font-normal text-muted-foreground">/night</span></p>
                        <p className="text-muted-foreground mt-4 text-lg">{room.description}</p>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <RoomBookingForm room={room} />
                </div>
            </div>
        </div>
    );
}
