import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to a default view or show instructions since the entry is via QR scan
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-sand-900 mb-4">Campus QR Portal</h1>
        <p className="text-sand-900/70 text-lg">
          Please scan a classroom QR code to access your division's subjects.
        </p>
      </div>
    </main>
  );
}
