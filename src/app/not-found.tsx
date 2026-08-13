import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-sand-100 shadow-neu-flat rounded-3xl p-10 max-w-sm w-full">
        <h2 className="text-6xl font-display font-bold text-sand-900 mb-4">404</h2>
        <h3 className="text-xl font-semibold text-sand-900 mb-2">Page Not Found</h3>
        <p className="text-sand-900/60 mb-8">
          The QR code might be invalid or the subject doesn't exist.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-sand-100 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-95 rounded-xl font-semibold text-sand-900 transition-all"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
