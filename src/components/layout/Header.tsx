import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { NotificationBell } from "./NotificationBell";

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
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline text-2xl">
              Gift Inn
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {label}
            </Link>
          ))}
          {session && (
             <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
             </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            {session && <NotificationBell session={session} />}
            {session ? (
                 <form action={logoutAction}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            ) : (
                <>
                 <Button asChild variant="outline" className="hidden md:inline-flex">
                    <Link href="/login">Login</Link>
                 </Button>
                 <Button asChild className="hidden md:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/register">Admin Register</Link>
                 </Button>
                </>
            )}
         
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 pt-12">
              <Link href="/" className="flex items-center mb-8 px-6">
                <span className="font-bold font-headline text-2xl">Gift Inn</span>
              </Link>
              <div className="flex flex-col space-y-4">
                {[...navLinks, ...(session ? [{href: "/dashboard", label: "Dashboard"}] : [])].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-lg font-medium px-6 py-2 hover:bg-primary rounded-l-full"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 px-6 flex flex-col space-y-2">
                 {session ? (
                     <form action={logoutAction}>
                        <Button type="submit" className="w-full">Logout</Button>
                    </form>
                 ) : (
                    <>
                        <Button asChild className="w-full">
                           <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                           <Link href="/register">Admin Register</Link>
                        </Button>
                    </>
                 )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
