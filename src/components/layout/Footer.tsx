import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
                <p className="font-headline text-2xl text-accent">Gift Inn</p>
                <p className="text-sm text-primary-foreground/80 mt-2 max-w-md">Experience an oasis of tranquility and luxury. Gift Inn offers a unique blend of comfort, style, and personalized service to make your stay unforgettable.</p>
            </div>
            <div>
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-primary-foreground/90">Quick Links</h4>
                <nav className="flex flex-col space-y-2">
                    <Link href="/" className="text-sm text-primary-foreground/80 hover:text-accent">Home</Link>
                    <Link href="/rooms" className="text-sm text-primary-foreground/80 hover:text-accent">Rooms</Link>
                    <Link href="/amenities" className="text-sm text-primary-foreground/80 hover:text-accent">Amenities</Link>
                    <Link href="/contact" className="text-sm text-primary-foreground/80 hover:text-accent">Contact Us</Link>
                </nav>
            </div>
            <div>
                 <h4 className="font-semibold mb-4 uppercase tracking-wider text-primary-foreground/90">Contact Us</h4>
                 <div className="text-sm text-primary-foreground/80 space-y-2">
                    <p>123 Luxury Lane, Tranquil City, 10101</p>
                    <p>reservations@giftinn.com</p>
                    <p>(555) 123-4567</p>
                 </div>
                 <div className="flex space-x-4 mt-4">
                     <Link href="#" className="text-primary-foreground/80 hover:text-accent"><Facebook size={20} /></Link>
                     <Link href="#" className="text-primary-foreground/80 hover:text-accent"><Twitter size={20} /></Link>
                     <Link href="#" className="text-primary-foreground/80 hover:text-accent"><Instagram size={20} /></Link>
                 </div>
            </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Gift Inn. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
