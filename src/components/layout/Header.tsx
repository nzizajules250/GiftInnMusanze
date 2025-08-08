import Link from "next/link";
import { BedDouble, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/attractions", label: "Attractions" },
  { href: "/contact", label: "Contact" },
];

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.slice(0, 2).map(({ href, label }) => (
            <Link key={href} href={href} className="transition-colors hover:text-primary text-foreground/80">{label}</Link>
          ))}
        </div>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline text-3xl text-primary">
              Gift Inn
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.slice(2).map(({ href, label }) => (
            <Link key={href} href={href} className="transition-colors hover:text-primary text-foreground/80">{label}</Link>
          ))}
        </div>
        
        <div className="flex md:hidden flex-1 justify-end">
             <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0 pt-12">
                    <Link href="/" className="flex items-center mb-8 px-6">
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
                             <Link href="/rooms/search"><BedDouble /> Book Now</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden md:flex items-center justify-end space-x-2 ml-4">
            <ModeToggle />
            {session ? (
                <>
                <Button asChild variant="outline"><Link href="/dashboard">Dashboard</Link></Button>
                 <form action={logoutAction}>
                    <Button type="submit" variant="ghost">Logout</Button>
                </form>
                </>
            ) : (
                 <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                 </Button>
            )}
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/rooms/search"><BedDouble /> Book Now</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
