"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/lib/types";

const baseNavLinks = [
  { href: "/dashboard", label: "My Dashboard", icon: Home, roles: ['guest', 'admin'] },
  { href: "/dashboard/profile", label: "Profile", icon: User, roles: ['guest', 'admin'] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ['guest', 'admin'] },
];

const adminNavLink = { href: "/dashboard/admin", label: "Admin", icon: Shield, roles: ['admin'] };


export function Sidebar({ session }: { session: SessionPayload | null }) {
  const pathname = usePathname();

  const sidebarNavLinks = [
      ...baseNavLinks,
      ...(session?.role === 'admin' ? [adminNavLink] : [])
  ];

  return (
    <div className="hidden md:block w-64 bg-card border-r p-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold px-4 mb-2">Dashboard</h2>
        {sidebarNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/50 hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
