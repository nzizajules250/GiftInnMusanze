'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { confirmBookingWithAIAction } from '@/lib/actions';

export function BookingConfirmation() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    const result = await confirmBookingWithAIAction(query);
    if (result.success && result.response) {
      setResponse(result.response);
    } else {
      setResponse(result.error || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <CardTitle>AI Booking Assistant</CardTitle>
        </div>
        <CardDescription>
          Have a question about your booking? Ask our AI assistant. For example: "Is my booking for the Deluxe Suite confirmed?"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your booking..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ask
          </Button>
        </form>
        {response && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-semibold">AI Response:</p>
                <p className="whitespace-pre-wrap">{response}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
