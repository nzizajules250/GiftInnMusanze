'use client';

import Link from "next/link";
import { BedDouble, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SessionPayload } from "@/lib/types";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

const navLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/attractions", label: "Attractions" },
  { href: "/contact", label: "Contact" },
];

interface HeaderClientProps {
    session: SessionPayload | null;
}

export function HeaderClient({ session }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === '/';

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled || !isHomePage ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent border-transparent",
        !isHomePage && "text-foreground",
        isHomePage && !scrolled && "text-white"
    )}>
      <div className="container flex h-20 items-center justify-between">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center space-x-2">
            <BedDouble className={cn("h-7 w-7", isHomePage && !scrolled ? "text-white" : "text-primary")} />
            <span className={cn("font-bold sm:inline-block font-headline text-3xl", isHomePage && !scrolled ? "text-white" : "text-primary")}>
              Gift Inn
            </span>
        </Link>
        
        {/* Desktop Nav - Center */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={cn("transition-colors", isHomePage && !scrolled ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary")}>{label}</Link>
          ))}
        </nav>

        {/* Mobile Nav - Hamburger */}
        <div className="flex items-center md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isHomePage && !scrolled && "hover:bg-white/10")}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0 pt-12 bg-background text-foreground">
                    <Link href="/" className="flex items-center gap-2 mb-8 px-6">
                        <BedDouble className="h-7 w-7 text-primary" />
                        <span className="font-bold font-headline text-2xl text-primary">Gift Inn</span>
                    </Link>
                    <div className="flex flex-col space-y-3">
                        {[...navLinks, ...(session ? [{href: "/dashboard", label: "Dashboard"}] : [])].map(({ href, label }) => (
                        <Link key={href} href={href} className="text-lg font-medium px-6 py-2 hover:bg-secondary rounded-l-full transition-colors">
                            {label}
                        </Link>
                        ))}
                    </div>
                    <Separator className="my-6" />
                     <div className="px-6 flex flex-col space-y-3">
                        {session ? (
                            <form action={logoutAction}>
                                <Button type="submit" className="w-full justify-start" variant="outline">Logout</Button>
                            </form>
                        ) : (
                            <Button asChild className="w-full justify-start">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                        <Button asChild variant="default" className="w-full justify-start">
                             <Link href="/rooms/search"><BedDouble className="mr-2 h-4 w-4" /> Book Now</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        
        {/* Desktop Nav - Right side */}
        <div className="hidden md:flex items-center justify-end gap-2">
            <ModeToggle />
            {session ? (
                <>
                <Button asChild variant="outline"><Link href="/dashboard">Dashboard</Link></Button>
                 <form action={logoutAction}>
                    <Button type="submit" variant={cn(isHomePage && !scrolled ? "secondary" : "ghost") as any}>Logout</Button>
                </form>
                </>
            ) : (
                 <Button asChild variant={cn(isHomePage && !scrolled ? "ghost" : "ghost") as any} className={cn(isHomePage && !scrolled && "hover:bg-white/10")}>
                    <Link href="/login">Login</Link>
                 </Button>
            )}
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/rooms/search"><BedDouble className="mr-2 h-4 w-4" /> Book Now</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
