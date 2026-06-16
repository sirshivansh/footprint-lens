"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon, User, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();

  // Map route path to page title
  const getPageTitle = () => {
    if (pathname === "/") return "Carbon Pulse";
    if (pathname?.startsWith("/lens")) return "Radical Transparency";
    if (pathname?.startsWith("/actions")) return "Your Action Coach";
    if (pathname?.startsWith("/cohort")) return "Carbon Cohorts";
    if (pathname?.startsWith("/impact")) return "Living Forest";
    if (pathname?.startsWith("/profile")) return "Profile Settings";
    if (pathname?.startsWith("/receipts")) return "Receipt Scanner";
    return "Footprint Lens";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-custom bg-background/80 px-6 backdrop-blur-md">
      {/* Mobile-only logo, desktop gets context title */}
      <div>
        <span className="font-serif text-lg font-bold tracking-tight text-soil md:hidden">
          🌿 Footprint Lens
        </span>
        <h1 className="hidden font-serif text-lg font-bold text-soil md:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Actions: Theme Toggle, Profile link */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-custom-btn border border-border-custom bg-surface text-soil hover:bg-soil/5 transition-all focus:outline-none focus:ring-2 focus:ring-clay"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-soil" />
          ) : (
            <Sun className="h-5 w-5 text-soil" />
          )}
        </button>

        {/* Profile Link (Mobile only or general header link) */}
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-custom-btn border border-border-custom bg-surface text-soil hover:bg-soil/5 transition-all focus:outline-none focus:ring-2 focus:ring-clay"
          aria-label="Profile Settings"
        >
          <Settings className="h-5 w-5 text-soil" />
        </Link>

        {/* Mini user indicator in mobile header */}
        {session?.user && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-sand font-bold text-sm font-sans md:hidden">
            {session.user.email ? session.user.email[0].toUpperCase() : "A"}
          </div>
        )}
      </div>
    </header>
  );
}
