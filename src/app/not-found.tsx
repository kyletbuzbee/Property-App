import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl text-dark-300 mb-8">Page Not Found</h2>
      <p className="text-dark-400 mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
