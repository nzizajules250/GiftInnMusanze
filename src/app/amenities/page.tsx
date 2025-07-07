import { AmenityCard } from "@/components/AmenityCard";
import { amenities } from "@/lib/mock-data";
import Image from "next/image";

export default function AmenitiesPage() {
  return (
    <>
      <section className="relative h-[40vh] bg-primary/20 flex items-center justify-center">
         <Image
            src="https://placehold.co/1920x400.png"
            alt="Relaxing spa setting"
            data-ai-hint="spa setting"
            fill
            className="object-cover"
          />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative text-center text-white z-10 p-4">
            <h1 className="text-5xl font-headline">Facilities & Services</h1>
            <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto">
                Designed for your well-being, our amenities offer a perfect blend of relaxation and recreation.
            </p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.title} amenity={amenity} />
          ))}
        </div>
      </div>
    </>
  );
}
