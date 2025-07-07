import { getRoomById } from "@/lib/firebase-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { RoomBookingForm } from "@/components/RoomBookingForm";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
    const room = await getRoomById(params.id);

    if (!room) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={room.image}
                            alt={`View of ${room.name}`}
                            data-ai-hint={room.hint}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
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
