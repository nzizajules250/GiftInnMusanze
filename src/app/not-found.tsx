import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold font-headline text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
