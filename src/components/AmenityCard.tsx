import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Amenity } from "@/lib/types";

interface AmenityCardProps {
  amenity: Amenity;
}

export function AmenityCard({ amenity }: AmenityCardProps) {
  const Icon = amenity.icon;
  return (
    <Card className="text-center p-6 transition-all duration-300 hover:bg-primary/50 hover:shadow-xl hover:-translate-y-2">
      <CardHeader className="items-center">
        <div className="p-4 bg-accent/30 rounded-full mb-4">
            <Icon className="w-8 h-8 text-accent-foreground" />
        </div>
        <CardTitle className="font-headline text-xl">{amenity.title}</CardTitle>
        <CardDescription className="pt-2">{amenity.description}</CardDescription>
        <CardDescription className="pt-2 font-semibold">{amenity.details}</CardDescription>
      </CardHeader>
    </Card>
  );
}
