"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (Sentry, etc.)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5 text-center">
      {/* Illustration */}
      <div className="text-6xl mb-6">🍂</div>

      {/* Heading */}
      <h1 className="font-serif text-4xl font-bold text-soil mb-3">
        Something went wrong
      </h1>

      {/* Message */}
      <p className="text-base text-muted font-sans max-w-md mb-8">
        An unexpected error occurred. Don&apos;t worry — your data is safe.
        Try refreshing or head back to the dashboard.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center h-11 px-6 rounded-custom-btn bg-soil text-sand font-semibold text-sm hover:bg-soil/95 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-custom-btn border border-border-custom text-soil font-semibold text-sm hover:bg-soil/5 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
