"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecommendationsAction } from "@/lib/actions";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import type { Room } from "@/lib/types";

const recommendationSchema = z.object({
  pastBehavior: z.string().min(10, { message: "Please describe your past stays or preferences." }),
  statedPreferences: z.string().min(10, { message: "Please tell us what you're looking for." }),
});

export function RecommendationEngine({ allRooms }: { allRooms: Room[] }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");

  const availableRoomsString = allRooms.map(r => `${r.name}: ${r.description}`).join('\n');

  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      pastBehavior: "",
      statedPreferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof recommendationSchema>) {
    setLoading(true);
    setRecommendation("");
    setError("");

    const result = await getRecommendationsAction({
      ...values,
      availableRooms: availableRoomsString,
    });
    
    if (result.success && result.data) {
      setRecommendation(result.data.recommendations);
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
          <Wand2 className="w-8 h-8 text-accent-foreground" />
        </div>
        <CardTitle className="font-headline text-3xl">Personalized Recommendations</CardTitle>
        <CardDescription>Let our AI concierge craft the perfect stay for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="pastBehavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Experiences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I previously stayed in a suite and enjoyed the extra space and city view. I often use the gym.'"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statedPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I'm looking for a quiet room for a romantic weekend. A nice view is important. I'm on a budget of around $300/night.'"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-center">
              <Button type="submit" disabled={loading} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </div>
          </form>
        </Form>
        {(recommendation || error) && (
            <div className="mt-8">
              {recommendation && (
                <Alert>
                  <AlertTitle className="font-headline text-xl">Your Personalized Suggestion</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap mt-2">{recommendation}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
