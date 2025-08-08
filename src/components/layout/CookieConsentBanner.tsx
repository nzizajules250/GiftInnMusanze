
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only run this effect on the client side
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };
  
  if (!showBanner) {
    return null;
  }

  return (
    <div className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t",
        "transition-transform duration-500 ease-in-out",
        showBanner ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. 
          <Link href="/privacy-policy" className="underline hover:text-primary ml-1">Learn more</Link>.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>Decline</Button>
          <Button size="sm" onClick={handleAccept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
