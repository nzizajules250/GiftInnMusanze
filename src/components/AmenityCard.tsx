import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Amenity } from "@/lib/types";

interface AmenityCardProps {
  amenity: Amenity;
}

export function AmenityCard({ amenity }: AmenityCardProps) {
  const Icon = amenity.icon;
  return (
    <div className="group perspective h-64">
        <div className="relative preserve-3d group-hover:rotate-y-180 w-full h-full duration-700">
            {/* Front of card */}
            <Card className="absolute backface-hidden w-full h-full text-center p-6 flex flex-col justify-center items-center shadow-xl">
                <div className="p-4 bg-accent/30 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-xl">{amenity.title}</CardTitle>
            </Card>
            {/* Back of card */}
            <Card className="absolute rotate-y-180 backface-hidden w-full h-full text-center p-6 flex flex-col justify-center items-center bg-primary/80 shadow-xl">
               <CardDescription className="text-primary-foreground">{amenity.description}</CardDescription>
               <CardDescription className="pt-4 font-semibold text-primary-foreground">{amenity.details}</CardDescription>
            </Card>
        </div>
    </div>
  );
}
