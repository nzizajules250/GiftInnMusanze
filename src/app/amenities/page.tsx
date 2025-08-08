import { AmenityCard } from "@/components/AmenityCard";
import { getAmenities } from "@/lib/firebase-service";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <>
      <section className="relative h-[50vh] flex items-center justify-center bg-primary">
         <Image
            src="https://i.ibb.co/KxtvRtpw/17.jpg"
            alt="Relaxing hotel amenity setting"
            data-ai-hint="hotel amenity"
            fill
            className="object-cover opacity-30"
          />
        <div className="relative text-center text-primary-foreground z-10 p-4">
            <h1 className="text-4xl sm:text-6xl font-headline">Facilities & Services</h1>
            <p className="text-lg text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
                Designed for your well-being, our amenities offer a perfect blend of relaxation and recreation.
            </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.id} amenity={amenity} />
          ))}
        </div>
      </div>
    </>
  );
}
