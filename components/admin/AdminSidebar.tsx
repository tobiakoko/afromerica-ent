"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Ticket,
  TrendingUp,
  Music,
  Settings
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Artists', href: '/admin/artists', icon: Music },
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Votes', href: '/admin/votes', icon: TrendingUp },
  { name: 'Finale', href: '/admin/finale', icon: Trophy },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-card border-b md:border-r min-h-[64px] md:min-h-screen sticky top-0 z-30">
      <div className="p-4 md:p-6 flex items-center justify-between md:block">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Afromerica"
            width={60}
            height={60}
            className="h-8 w-auto object-contain"
          />
          <p className="text-sm text-muted-foreground hidden md:block">Admin Panel</p>
        </div>
      </div>

      <nav className="space-y-1 px-3 pb-3 overflow-x-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.name} className="flex">
              {/* Mobile: icon only with accessible label */}
              <Link
                href={item.href}
                className={cn(
                  "flex md:hidden items-center justify-center px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={item.name}
                aria-label={item.name}
              >
                <Icon className="w-5 h-5" />
                <span className="sr-only">{item.name}</span>
              </Link>

              {/* Desktop: icon + label */}
              <Link
                href={item.href}
                className={cn(
                  "hidden md:flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
