"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Shield, Settings, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/types";

const baseNavLinks = [
  { href: "/dashboard", label: "My Dashboard", icon: Home, roles: ['guest', 'admin'] },
  { href: "/dashboard/profile", label: "Profile", icon: User, roles: ['guest', 'admin'] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ['guest', 'admin'] },
];

const adminNavLink = { href: "/dashboard/admin", label: "Admin", icon: Shield, roles: ['admin'] };

interface SidebarProps {
    session: SessionPayload | null;
    isMobile?: boolean;
}

export function Sidebar({ session, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const sidebarNavLinks = [
      ...baseNavLinks,
      ...(session?.role === 'admin' ? [adminNavLink] : [])
  ];

  const navContent = (
    <nav className={cn(
        "grid items-start text-sm font-medium",
        isMobile ? "px-2" : "px-2 lg:px-4"
    )}>
        {sidebarNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = (link.href === '/dashboard/admin' && pathname.startsWith('/dashboard/admin')) || pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
  );

  if (isMobile) {
      return (
        <>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <BedDouble className="h-6 w-6 text-primary" />
                    <span>Gift Inn</span>
                </Link>
            </div>
            <div className="flex-1 py-2">
                {navContent}
            </div>
        </>
      )
  }

  return navContent;
}
