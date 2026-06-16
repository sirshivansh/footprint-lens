"use client";

import React, { useEffect } from "react";
import { NavBar } from "@/components/layout/nav-bar";
import { Header } from "@/components/layout/header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/welcome");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Skeleton className="h-[500px] w-full max-w-3xl rounded-custom-card" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row">
      {/* Navigation: Bottom on mobile, Left Sidebar on desktop */}
      <NavBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
