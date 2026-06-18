"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Compass, Users, TreePine, LogOut, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut, useSession } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Lens", href: "/lens", icon: Camera },
  { label: "Actions", href: "/actions", icon: Compass },
  { label: "Cohort", href: "/cohort", icon: Users },
  { label: "Impact", href: "/impact", icon: TreePine },
  { label: "Docs", href: "/docs/index.html", icon: BookOpen, external: true },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border-custom bg-surface/90 backdrop-blur-md md:hidden">
        <div className="flex h-full items-center justify-around">
          {navItems.map((item) => {
            const isActive = !item.external && (pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href)));
            const Icon = item.icon;
            const Component = item.external ? "a" : Link;
            const extraProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Component
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-12 h-full text-xs font-semibold font-sans transition-colors focus:outline-none focus:text-clay",
                  isActive
                    ? "text-clay dark:text-clay"
                    : "text-muted hover:text-soil dark:hover:text-soil"
                )}
                {...extraProps}
              >
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span>{item.label}</span>
              </Component>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="fixed bottom-0 top-0 left-0 z-40 hidden w-64 border-r border-border-custom bg-surface p-6 md:flex md:flex-col justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <span className="font-serif text-xl font-bold tracking-tight text-soil">
              🌿 Footprint Lens
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = !item.external && (pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href)));
              const Icon = item.icon;
              const Component = item.external ? "a" : Link;
              const extraProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
              return (
                <Component
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-custom-btn px-4 py-3 text-sm font-semibold font-sans transition-all focus:outline-none focus:ring-2 focus:ring-clay",
                    isActive
                      ? "bg-soil text-sand dark:bg-soil dark:text-sand"
                      : "text-muted hover:bg-soil/5 hover:text-soil dark:hover:bg-soil/10"
                  )}
                  {...extraProps}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Component>
              );
            })}
          </div>
        </div>

        {/* User Info & Actions */}
        {session?.user && (
          <div className="flex flex-col gap-4 border-t border-border-custom pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-clay/20 flex items-center justify-center text-clay font-bold font-sans">
                {session.user.email ? session.user.email[0].toUpperCase() : "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-muted">
                  {(session.user as any).isAnonymous ? "Guest Session" : "Signed In"}
                </span>
                <span className="truncate text-sm font-bold text-soil">
                  {session.user.email || "Anonymous"}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full rounded-custom-btn px-4 py-3 text-sm font-semibold font-sans text-muted hover:bg-ember/5 hover:text-ember transition-all focus:outline-none focus:ring-2 focus:ring-ember"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
