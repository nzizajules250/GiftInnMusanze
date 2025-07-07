"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Update input if user navigates with back/forward buttons
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/rooms/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/rooms`); // Go to all rooms if search is empty
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:flex">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        placeholder="Search rooms..."
        className="pl-8 md:w-[200px] lg:w-[300px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
