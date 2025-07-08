import { AmenityCard } from "@/components/AmenityCard";
import { getAmenities } from "@/lib/firebase-service";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <>
      <section className="relative h-[40vh] flex items-center justify-center">
         <Image
            src="https://placehold.co/1920x400.png"
            alt="Relaxing spa setting"
            data-ai-hint="spa setting"
            fill
            className="object-cover"
          />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative text-center text-primary-foreground z-10 p-4">
            <h1 className="text-5xl font-headline">Facilities & Services</h1>
            <p className="text-lg text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
                Designed for your well-being, our amenities offer a perfect blend of relaxation and recreation.
            </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>
      </div>
    </>
  );
}
