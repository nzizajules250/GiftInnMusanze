import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <p className="font-headline text-xl">Gift Inn</p>
            <p className="text-sm text-muted-foreground">123 Luxury Lane, Tranquil City, 10101</p>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
             <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook size={20} /></Link>
             <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter size={20} /></Link>
             <Link href="#" className="text-muted-foreground hover:text-foreground"><Instagram size={20} /></Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Gift Inn. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
