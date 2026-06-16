"use client";

import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Skeleton } from "@/components/ui";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // If not logged in, trigger anonymous sign in automatically in the background
    if (status === "unauthenticated") {
      console.log("[AUTH] Triggering background anonymous sign-in...");
      signIn("credentials", { anonymous: "true", redirect: false }).catch((err) => {
        console.error("[AUTH] Anonymous sign-in failed:", err);
      });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Skeleton className="h-96 w-full max-w-md rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}
