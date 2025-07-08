import Image from "next/image";

export function AttractionsMap() {
  return (
    <div className="relative w-full h-[400px] lg:h-full">
      <Image
        src="https://placehold.co/800x600.png"
        alt="Map of local attractions"
        data-ai-hint="city map"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-black/80 p-4 rounded-md text-center shadow-lg">
            <h3 className="font-bold">Map is for illustrative purposes.</h3>
            <p className="text-sm">Interactive map coming soon.</p>
        </div>
      </div>
    </div>
  );
}
