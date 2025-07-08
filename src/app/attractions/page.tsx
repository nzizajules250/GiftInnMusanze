import { Card } from "@/components/ui/card";
import { getAttractions } from "@/lib/firebase-service";
import { AttractionsMap } from "@/components/AttractionsMap";
import { getIcon } from "@/lib/icons";

export const dynamic = 'force-dynamic';

export default async function AttractionsPage() {
  const attractions = await getAttractions();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-headline text-primary">Explore the Neighborhood</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Gift Inn is perfectly situated to offer you the best of the city, from cultural landmarks to natural retreats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-4">
          {attractions.map((attraction) => {
            const Icon = getIcon(attraction.icon);
            return (
              <Card key={attraction.id} className="flex items-center p-4 hover:bg-secondary transition-colors">
                <Icon className="w-8 h-8 mr-4 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{attraction.name}</h3>
                  <p className="text-sm text-muted-foreground">{attraction.distance}</p>
                </div>
              </Card>
            )
          })}
        </div>
        <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full shadow-lg">
                <AttractionsMap />
            </Card>
        </div>
      </div>
    </div>
  );
}
