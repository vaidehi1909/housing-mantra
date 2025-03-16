"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Users,
  UserCog,
  User,
  UsersIcon,
  Building2,
  Home,
  ClipboardList,
  UserPlus,
  LineChart,
  DollarSign,
  Wallet,
  CalendarCheck,
  BookOpen,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: BarChart2, label: "Stats", href: "/stats" },
    { icon: UserCog, label: "Admin", href: "/admin" },
    { icon: Users, label: "Agent", href: "/agents" },
    { icon: User, label: "Owner", href: "/owners" },
    { icon: UsersIcon, label: "Team", href: "/team" },
    { icon: Building2, label: "Developer", href: "/developers" },
    { icon: Home, label: "Project", href: "/projects" },
    { icon: Building2, label: "Property", href: "/properties" },
    { icon: ClipboardList, label: "Listing", href: "/listings" },
    { icon: UserPlus, label: "Leads", href: "/leads" },
    { icon: Users, label: "Customer", href: "/customers" },
    { icon: LineChart, label: "Analytics", href: "/analytics" },
    { icon: DollarSign, label: "Sales", href: "/sales" },
    { icon: Wallet, label: "Income Generated", href: "/income" },
    { icon: CalendarCheck, label: "Site Visit", href: "/site-visits" },
    { icon: BookOpen, label: "Booking", href: "/bookings" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/projects") {
      // Match any route that starts with /projects
      return pathname.startsWith("/projects");
    }
    return pathname === href;
  };

  return (
    <div className={cn("pb-12 min-h-screen bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-semibold">Housing Mantra</h2>
          </div>
          <div className="text-sm text-gray-500 mb-4">Super Admin</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActiveRoute(item.href)
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
