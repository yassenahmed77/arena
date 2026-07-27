import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
      <h2 className="font-heading font-bold text-2xl text-text">404 - Page Not Found</h2>
      <p className="font-mono text-sm text-text-dim">The page you are looking for does not exist.</p>
      <Link href="/" className="font-mono text-xs text-accent hover:underline">
        Return Home
      </Link>
    </div>
  );
}
