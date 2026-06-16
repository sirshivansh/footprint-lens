import React from "react";
import { cn } from "@/lib/cn";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PageShell({ children, className, maxWidth = "lg" }: PageShellProps) {
  const maxWidths = {
    sm: "max-w-xl", // 576px
    md: "max-w-2xl", // 672px (for reading-focused screens, recommended for text-heavy content)
    lg: "max-w-4xl", // 896px
    xl: "max-w-6xl", // 1152px (standard dashboard view)
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 md:px-8 pb-24 md:pb-8",
        maxWidths[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
