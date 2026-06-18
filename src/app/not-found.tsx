import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5 text-center">
      {/* Illustration */}
      <div className="text-6xl mb-6">🌿</div>

      {/* Heading */}
      <h1 className="font-serif text-4xl font-bold text-soil mb-3">
        Lost in the forest
      </h1>

      {/* Message */}
      <p className="text-base text-muted font-sans max-w-md mb-8">
        The page you&apos;re looking for has wandered off the trail.
        Let&apos;s get you back to solid ground.
      </p>

      {/* CTA */}
      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-6 rounded-custom-btn bg-soil text-sand font-semibold text-sm hover:bg-soil/95 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
